from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class TicketPriorityEnum(str, Enum):
    P1_CRITICAL = "P1_CRITICAL"
    P2_HIGH = "P2_HIGH"
    P3_MEDIUM = "P3_MEDIUM"
    P4_LOW = "P4_LOW"

class TicketStatusEnum(str, Enum):
    NEW = "NEW"
    IN_PROGRESS = "IN_PROGRESS"
    WAITING_ON_EMPLOYEE = "WAITING_ON_EMPLOYEE"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"

class TicketCreateRequest(BaseModel):
    employee_id: str = Field(..., example="EMP-101")
    category: str = Field(..., example="IT_HARDWARE") # IT_HARDWARE / HR_BENEFITS / FINANCE_PAYROLL
    subject: str = Field(..., example="MacBook Pro Keyboard Malfunction")
    description: str = Field(..., example="Spacebar key is sticking on my laptop.")
    priority: TicketPriorityEnum = TicketPriorityEnum.P2_HIGH
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class TicketRecordResponse(BaseModel):
    ticket_id: str
    employee_id: str
    category: str
    subject: str
    priority: TicketPriorityEnum
    status: TicketStatusEnum
    assigned_queue: str = "IT_TIER_2_QUEUE"
    response_sla_deadline: str
    resolution_sla_deadline: str
    sla_breached: bool = False
    created_at: str

class AIConversationRequest(BaseModel):
    employee_id: str = Field(..., example="EMP-101")
    user_query: str = Field(..., example="How do I submit my annual W-4 tax document?")

class AIConversationResponse(BaseModel):
    intent_classified: str = "HR_TAX_QUERY"
    ai_response_text: str
    suggested_knowledge_articles: List[Dict[str, str]]
    ticket_auto_created: bool = False
    created_ticket_id: Optional[str] = None

class CSATSubmissionRequest(BaseModel):
    ticket_id: str
    rating_stars: int = Field(..., ge=1, le=5, example=5)
    feedback_notes: Optional[str] = Field(default="Fast resolution within 1 hour!")

class HelpdeskAnalyticsMetrics(BaseModel):
    first_contact_resolution_rate_pct: float = 78.5
    sla_compliance_rate_pct: float = 98.2
    average_resolution_hours: float = 3.2
    csat_average_score: float = 4.85
    open_tickets_count: int = 14
