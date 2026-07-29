import time
from typing import Dict, Any, List, Optional
from app.agents.supervisor.models import (
    SupervisorStateModel,
    SupervisorStepStatus,
    SupervisorOrchestrateRequest,
    SupervisorApprovalAction
)
from app.agents.supervisor.agent_registry import EnterpriseAgentRegistry
from app.agents.supervisor.checkpoint_engine import CheckpointEngineService

class LangGraphSupervisorOrchestrator:
    """
    Master LangGraph StateGraph Orchestrator
    Coordinates sub-agent DAG execution, ReAct quality gates, checkpointing, and human approval gates.
    """
    active_dags_db: Dict[str, SupervisorStateModel] = {}
    pending_approvals_db: Dict[str, Dict[str, Any]] = {}

    @classmethod
    def orchestrate_prompt(cls, req: SupervisorOrchestrateRequest) -> SupervisorStateModel:
        dag_id = f"SUP-DAG-{int(time.time() * 1000)}"
        tenant_id = req.tenant_id or "TNT-TALENTOS-01"
        user_id = req.user_id or "USR-101"
        user_role = req.user_role or "HR_ADMIN"

        # 1. Discover relevant sub-agents matching prompt intent
        discovered_agents = EnterpriseAgentRegistry.discover_agents(req.prompt)

        # 2. Build initial Supervisor State
        state = SupervisorStateModel(
            dag_id=dag_id,
            tenant_id=tenant_id,
            user_id=user_id,
            user_role=user_role,
            prompt=req.prompt,
            current_step_index=0,
            executed_steps=[],
            pending_approvals=[],
            checkpoint_id="",
            status=SupervisorStepStatus.RUNNING,
            total_tokens=140,
            total_cost_usd=0.00021,
            started_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            updated_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )

        # Create initial Checkpoint 0
        CheckpointEngineService.create_checkpoint(state)

        # Node 1: Intent & Planning Step
        state.executed_steps.append({
            "step": 1,
            "agent_id": "SUPERVISOR",
            "action": "Intent Routing & Sub-Agent Discovery",
            "thought": f"Discovered {len(discovered_agents)} sub-agents: {[a['agent_id'] for a in discovered_agents]}",
            "quality_score": 97.0,
            "tokens": 140,
            "cost_usd": 0.00021
        })

        # Node 2+: Sub-Agent Execution Nodes
        for idx, agent in enumerate(discovered_agents, start=2):
            state.current_step_index = idx - 1

            # Simulate ReAct Reflection Quality Check
            quality_score = 92.0

            # Check if high-risk action requires Human Approval Gate
            if agent["agent_id"] == "PAYROLL" and "disbursal" in req.prompt.lower():
                state.status = SupervisorStepStatus.WAITING_APPROVAL
                approval_id = f"SUP-APR-{int(time.time() * 1000)}"
                approval_record = {
                    "approval_id": approval_id,
                    "dag_id": dag_id,
                    "tenant_id": tenant_id,
                    "agent_id": agent["agent_id"],
                    "action_name": "Payroll Disbursal Authorization",
                    "status": "PENDING",
                    "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                }
                state.pending_approvals.append(approval_record)
                cls.pending_approvals_db[approval_id] = approval_record
                
                # Checkpoint at approval gate
                CheckpointEngineService.create_checkpoint(state)
                cls.active_dags_db[dag_id] = state
                return state

            # Append completed step
            step_tokens = 280
            step_cost = 0.00042
            state.total_tokens += step_tokens
            state.total_cost_usd += step_cost

            state.executed_steps.append({
                "step": idx,
                "agent_id": agent["agent_id"],
                "action": f"Executed {agent['name']}",
                "thought": f"Completed capability execution: {agent['capabilities'][0]}",
                "quality_score": quality_score,
                "tokens": step_tokens,
                "cost_usd": step_cost
            })

            # Checkpoint step
            CheckpointEngineService.create_checkpoint(state)

        state.status = SupervisorStepStatus.COMPLETED
        state.updated_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        cls.active_dags_db[dag_id] = state

        return state

    @classmethod
    def act_on_approval(cls, action: SupervisorApprovalAction) -> SupervisorStateModel:
        """Process manager approval / rejection for paused Supervisor StateGraph."""
        approval = cls.pending_approvals_db.get(action.approval_id)
        if not approval or approval["status"] != "PENDING":
            raise ValueError("Invalid or processed approval request.")

        dag_id = approval["dag_id"]
        state = cls.active_dags_db.get(dag_id)
        if not state:
            raise ValueError("Supervisor state not found for approval.")

        if action.action.upper() == "APPROVE":
            approval["status"] = "APPROVED"
            state.status = SupervisorStepStatus.COMPLETED
            state.pending_approvals = []
            state.executed_steps.append({
                "step": len(state.executed_steps) + 1,
                "agent_id": approval["agent_id"],
                "action": "Human Approval Granted",
                "thought": f"Action authorized by {action.approver_id}: {action.comments or 'Authorized'}",
                "quality_score": 100.0,
                "tokens": 100,
                "cost_usd": 0.00015
            })
        else:
            approval["status"] = "REJECTED"
            state.status = SupervisorStepStatus.FAILED
            state.pending_approvals = []
            state.executed_steps.append({
                "step": len(state.executed_steps) + 1,
                "agent_id": approval["agent_id"],
                "action": "Human Approval Declined",
                "thought": f"Action rejected by {action.approver_id}: {action.comments or 'Declined'}",
                "quality_score": 0.0,
                "tokens": 50,
                "cost_usd": 0.000075
            })

        state.updated_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        CheckpointEngineService.create_checkpoint(state)
        return state
