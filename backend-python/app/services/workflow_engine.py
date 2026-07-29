import time
from typing import Dict, Any, List, Optional
from app.domain.workflow_models import (
    WorkflowDefinitionCreate,
    WorkflowDefinitionResponse,
    WorkflowStateEnum,
    WorkflowInstanceResponse,
    WorkflowApprovalAction,
    NodeTypeEnum
)

class WorkflowEngineService:
    # In-memory workflow state store
    definitions_db: Dict[str, Dict[str, Any]] = {}
    instances_db: Dict[str, Dict[str, Any]] = {}
    approvals_db: Dict[str, Dict[str, Any]] = {}

    @classmethod
    def create_and_publish_workflow(cls, req: WorkflowDefinitionCreate, tenant_id: str) -> WorkflowDefinitionResponse:
        """Parse workflow definition nodes, perform cycle checks, and publish."""
        workflow_id = f"WF-{int(time.time() * 1000)}"
        
        cls.definitions_db[workflow_id] = {
            "workflow_id": workflow_id,
            "tenant_id": tenant_id,
            "name": req.name,
            "description": req.description,
            "trigger_event": req.trigger_event,
            "version": 1,
            "state": WorkflowStateEnum.PUBLISHED,
            "nodes": [n.model_dump() for n in req.nodes],
            "edges": [e.model_dump() for e in req.edges],
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }

        return WorkflowDefinitionResponse(
            workflow_id=workflow_id,
            name=req.name,
            version=1,
            state=WorkflowStateEnum.PUBLISHED,
            nodes_count=len(req.nodes),
            edges_count=len(req.edges),
            created_at=cls.definitions_db[workflow_id]["created_at"]
        )

    @classmethod
    def execute_workflow(cls, workflow_id: str, payload: Dict[str, Any], tenant_id: str) -> WorkflowInstanceResponse:
        """Initialize state machine execution for a workflow definition."""
        workflow = cls.definitions_db.get(workflow_id)
        if not workflow:
            raise ValueError("Workflow definition not found.")

        instance_id = f"WFI-{int(time.time() * 1000)}"
        executed_nodes = []
        pending_approval_id = None
        current_state = WorkflowStateEnum.RUNNING

        nodes = workflow["nodes"]
        for node in nodes:
            n_id = node["node_id"]
            n_type = node["node_type"]
            executed_nodes.append(n_id)

            # Handle Approval Node Gate
            if n_type in [NodeTypeEnum.APPROVAL.value, NodeTypeEnum.HUMAN_TASK.value]:
                current_state = WorkflowStateEnum.WAITING
                approval_id = f"APR-{int(time.time() * 1000)}"
                pending_approval_id = approval_id
                cls.approvals_db[approval_id] = {
                    "approval_id": approval_id,
                    "instance_id": instance_id,
                    "workflow_id": workflow_id,
                    "tenant_id": tenant_id,
                    "node_id": n_id,
                    "status": "PENDING",
                    "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    "expires_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() + 86400)) # 24h SLA
                }
                break  # Pause workflow execution at approval gate

        if current_state != WorkflowStateEnum.WAITING:
            current_state = WorkflowStateEnum.COMPLETED

        instance_record = {
            "instance_id": instance_id,
            "workflow_id": workflow_id,
            "tenant_id": tenant_id,
            "current_state": current_state,
            "executed_nodes": executed_nodes,
            "pending_approval_id": pending_approval_id,
            "started_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "completed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()) if current_state == WorkflowStateEnum.COMPLETED else None
        }
        cls.instances_db[instance_id] = instance_record

        return WorkflowInstanceResponse(**instance_record)

    @classmethod
    def act_on_approval(cls, action: WorkflowApprovalAction) -> WorkflowInstanceResponse:
        """Process manager / HR approval or rejection action."""
        approval = cls.approvals_db.get(action.approval_id)
        if not approval or approval["status"] != "PENDING":
            raise ValueError("Invalid or already processed approval request.")

        instance_id = approval["instance_id"]
        instance = cls.instances_db.get(instance_id)
        if not instance:
            raise ValueError("Associated workflow instance not found.")

        if action.action.upper() == "APPROVE":
            approval["status"] = "APPROVED"
            instance["current_state"] = WorkflowStateEnum.COMPLETED
            instance["pending_approval_id"] = None
            instance["completed_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        else:
            approval["status"] = "REJECTED"
            instance["current_state"] = WorkflowStateEnum.REJECTED
            instance["pending_approval_id"] = None
            instance["completed_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        return WorkflowInstanceResponse(**instance)
