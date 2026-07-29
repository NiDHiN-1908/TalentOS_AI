from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class SupervisorStepStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    WAITING_APPROVAL = "WAITING_APPROVAL"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    RETRYING = "RETRYING"

class SupervisorStateModel(BaseModel):
    dag_id: str
    tenant_id: str
    user_id: str
    user_role: str
    prompt: str
    current_step_index: int = 0
    executed_steps: List[Dict[str, Any]] = Field(default_factory=list)
    pending_approvals: List[Dict[str, Any]] = Field(default_factory=list)
    checkpoint_id: str
    status: SupervisorStepStatus = SupervisorStepStatus.PENDING
    total_tokens: int = 0
    total_cost_usd: float = 0.0
    started_at: str
    updated_at: str

class CheckpointRecord(BaseModel):
    checkpoint_id: str
    dag_id: str
    tenant_id: str
    step_index: int
    state_snapshot: Dict[str, Any]
    created_at: str

class SupervisorOrchestrateRequest(BaseModel):
    prompt: str = Field(..., example="Audit July payroll anomalies and check recruitment candidates")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")
    user_id: Optional[str] = Field(default="USR-101")
    user_role: Optional[str] = Field(default="HR_ADMIN")

class SupervisorApprovalAction(BaseModel):
    approval_id: str
    action: str = Field(..., example="APPROVE")  # APPROVE / REJECT
    approver_id: str
    comments: Optional[str] = None
