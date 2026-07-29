from fastapi import APIRouter, HTTPException, Header, Depends
from typing import List, Optional, Dict, Any
from app.domain.workflow_models import (
    WorkflowDefinitionCreate,
    WorkflowDefinitionResponse,
    WorkflowExecutionRequest,
    WorkflowApprovalAction,
    WorkflowInstanceResponse
)
from app.services.workflow_engine import WorkflowEngineService

router = APIRouter(prefix="/workflows", tags=["Workflow Engine"])

@router.post("", response_model=WorkflowDefinitionResponse)
def create_and_publish_workflow(req: WorkflowDefinitionCreate, x_tenant_id: Optional[str] = Header(default="TNT-TALENTOS-01")):
    try:
        return WorkflowEngineService.create_and_publish_workflow(req, x_tenant_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/execute", response_model=WorkflowInstanceResponse)
def execute_workflow(req: WorkflowExecutionRequest, x_tenant_id: Optional[str] = Header(default="TNT-TALENTOS-01")):
    try:
        return WorkflowEngineService.execute_workflow(req.workflow_id, req.trigger_payload, x_tenant_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/approvals/act", response_model=WorkflowInstanceResponse)
def act_on_approval(action: WorkflowApprovalAction):
    try:
        return WorkflowEngineService.act_on_approval(action)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/instances/{instance_id}", response_model=WorkflowInstanceResponse)
def get_workflow_instance(instance_id: str):
    instance = WorkflowEngineService.instances_db.get(instance_id)
    if not instance:
        raise HTTPException(status_code=404, detail="Workflow instance not found.")
    return WorkflowInstanceResponse(**instance)
