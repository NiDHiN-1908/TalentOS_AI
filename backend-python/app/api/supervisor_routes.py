from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from app.agents.supervisor.models import (
    SupervisorOrchestrateRequest,
    SupervisorStateModel,
    SupervisorApprovalAction,
    CheckpointRecord
)
from app.agents.supervisor.agent_registry import EnterpriseAgentRegistry
from app.agents.supervisor.checkpoint_engine import CheckpointEngineService
from app.agents.supervisor.langgraph_orchestrator import LangGraphSupervisorOrchestrator

router = APIRouter(prefix="/supervisor", tags=["LangGraph Supervisor Engine"])

@router.post("/orchestrate", response_model=SupervisorStateModel)
def orchestrate_supervisor_prompt(req: SupervisorOrchestrateRequest):
    try:
        return LangGraphSupervisorOrchestrator.orchestrate_prompt(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/agents")
def list_discovered_sub_agents(prompt: str = "general"):
    return EnterpriseAgentRegistry.discover_agents(prompt)

@router.get("/checkpoints/{checkpoint_id}", response_model=CheckpointRecord)
def get_checkpoint_snapshot(checkpoint_id: str):
    record = CheckpointEngineService.get_checkpoint(checkpoint_id)
    if not record:
        raise HTTPException(status_code=404, detail="Checkpoint record not found.")
    return record

@router.post("/approvals/act", response_model=SupervisorStateModel)
def act_on_supervisor_approval(action: SupervisorApprovalAction):
    try:
        return LangGraphSupervisorOrchestrator.act_on_approval(action)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
