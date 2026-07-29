from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from enum import Enum

class OfferStatusEnum(str, Enum):
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    EXTENDED = "EXTENDED"
    UNDER_NEGOTIATION = "UNDER_NEGOTIATION"
    OFFER_ACCEPTED = "OFFER_ACCEPTED"
    OFFER_DECLINED = "OFFER_DECLINED"
    EXPIRED = "EXPIRED"

class OfferCreateRequest(BaseModel):
    candidate_id: str = Field(..., example="CND-101")
    candidate_name: str = Field(..., example="Sarah Chen")
    candidate_email: EmailStr = Field(..., example="sarah.chen@talentos.ai")
    req_id: str = Field(..., example="REQ-101")
    job_title: str = Field(..., example="Principal AI Architect")
    department: str = Field(..., example="Engineering")
    base_salary: float = Field(..., example=210000)
    signing_bonus: float = Field(default=25000)
    equity_units: int = Field(default=5000)
    relocation_stipend: float = Field(default=10000)
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class CompensationRecommendationResponse(BaseModel):
    recommended_base_salary: float = 210000.0
    recommended_signing_bonus: float = 25000.0
    equity_units: int = 5000
    market_percentile: float = 78.5
    acceptance_probability_pct: float = 88.5
    pay_equity_status: str = "EQUITY_VERIFIED"
    pay_equity_variance_pct: float = 2.1
    explanation: str

class OfferApprovalAction(BaseModel):
    offer_id: str
    approver_id: str
    approver_role: str = Field(..., example="FINANCE_APPROVER")
    action: str = Field(..., example="APPROVE") # APPROVE / REJECT
    comments: Optional[str] = None

class CounterOfferRequest(BaseModel):
    offer_id: str
    proposed_base_salary: float = Field(..., example=220000)
    proposed_signing_bonus: float = Field(default=30000)
    candidate_notes: str = Field(..., example="Requesting alignment with Bay Area market 80th percentile.")

class OfferEInterfaceResponse(BaseModel):
    offer_id: str
    candidate_name: str
    job_title: str
    status: OfferStatusEnum
    base_salary: float
    signing_bonus: float
    total_comp_first_year: float
    onboarding_workflow_triggered: bool = False
    expires_at: str

class OfferAnalyticsMetrics(BaseModel):
    offer_acceptance_rate_pct: float = 88.5
    average_negotiation_rate_pct: float = 14.2
    time_to_offer_days: float = 4.2
    active_offers_count: int = 8
    budget_utilization_pct: float = 92.4
