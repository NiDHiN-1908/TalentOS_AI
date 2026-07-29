from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class WorkflowStateEnum(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    RUNNING = "RUNNING"
    WAITING = "WAITING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    FAILED = "FAILED"
    RETRYING = "RETRYING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    ARCHIVED = "ARCHIVED"

class NodeTypeEnum(str, Enum):
    START = "START"
    END = "END"
    DECISION = "DECISION"
    CONDITION = "CONDITION"
    PARALLEL = "PARALLEL"
    MERGE = "MERGE"
    APPROVAL = "APPROVAL"
    AI_DECISION = "AI_DECISION"
    EMAIL = "EMAIL"
    NOTIFICATION = "NOTIFICATION"
    SMS = "SMS"
    WHATSAPP = "WHATSAPP"
    DOC_GENERATION = "DOC_GENERATION"
    DELAY = "DELAY"
    API_CALL = "API_CALL"
    DATABASE_ACTION = "DATABASE_ACTION"
    FILE_UPLOAD = "FILE_UPLOAD"
    WEBHOOK = "WEBHOOK"
    HUMAN_TASK = "HUMAN_TASK"
    AGENT_TASK = "AGENT_TASK"
    SCRIPT_EXECUTION = "SCRIPT_EXECUTION"

class NodePosition(BaseModel):
    x: float = Field(default=0.0)
    y: float = Field(default=0.0)

class WorkflowNodeSchema(BaseModel):
    node_id: str
    node_type: NodeTypeEnum
    label: str
    position: Optional[NodePosition] = Field(default_factory=NodePosition)
    config: Dict[str, Any] = Field(default_factory=dict)

class WorkflowEdgeSchema(BaseModel):
    edge_id: str
    source_node: str
    target_node: str
    condition_expression: Optional[str] = None

class WorkflowDefinitionCreate(BaseModel):
    name: str = Field(..., example="Employee Onboarding Workflow")
    description: Optional[str] = Field(default="11-step automated onboarding sequence")
    trigger_event: str = Field(default="talentos.offer.accepted")
    nodes: List[WorkflowNodeSchema]
    edges: List[WorkflowEdgeSchema]

class WorkflowDefinitionResponse(BaseModel):
    workflow_id: str
    name: str
    version: int
    state: WorkflowStateEnum
    nodes_count: int
    edges_count: int
    created_at: str

class WorkflowExecutionRequest(BaseModel):
    workflow_id: str
    trigger_payload: Dict[str, Any] = Field(default_factory=dict)

class WorkflowApprovalAction(BaseModel):
    approval_id: str
    action: str = Field(..., example="APPROVE")  # APPROVE / REJECT
    approver_id: str
    comments: Optional[str] = None

class WorkflowInstanceResponse(BaseModel):
    instance_id: str
    workflow_id: str
    tenant_id: str
    current_state: WorkflowStateEnum
    executed_nodes: List[str]
    pending_approval_id: Optional[str] = None
    started_at: str
    completed_at: Optional[str] = None
