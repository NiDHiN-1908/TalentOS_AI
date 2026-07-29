from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from enum import Enum

class OnboardingStatusEnum(str, Enum):
    PREBOARDING = "PREBOARDING"
    DOCUMENT_VERIFICATION = "DOCUMENT_VERIFICATION"
    IT_PROVISIONING = "IT_PROVISIONING"
    DAY_ONE_ACTIVE = "DAY_ONE_ACTIVE"
    PROBATION_ACTIVE = "PROBATION_ACTIVE"
    COMPLETED = "COMPLETED"

class DepartmentTaskCategoryEnum(str, Enum):
    HR = "HR"
    IT = "IT"
    MANAGER = "MANAGER"
    FINANCE = "FINANCE"
    FACILITIES = "FACILITIES"
    LEARNING = "LEARNING"

class OnboardingTaskItem(BaseModel):
    task_id: str
    category: DepartmentTaskCategoryEnum
    title: str
    assignee_role: str
    is_completed: bool = False
    due_days_from_start: int
    completed_at: Optional[str] = None

class PreboardingSubmissionRequest(BaseModel):
    offer_id: str = Field(..., example="OFR-101")
    candidate_name: str = Field(..., example="Sarah Chen")
    personal_email: EmailStr = Field(..., example="sarah.chen@gmail.com")
    phone: str = Field(..., example="+14155552671")
    target_joining_date: str = Field(..., example="2026-08-15")
    bank_account_number: str = Field(..., example="****5678")
    emergency_contact: str = Field(..., example="John Chen (Spouse) - +14155559999")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class ITProvisioningResult(BaseModel):
    provisioning_id: str
    corporate_email: str = Field(..., example="sarah.chen@talentos.ai")
    sso_account_created: bool = True
    laptop_ticket_id: str = Field(..., example="TKT-HARDWARE-901")
    software_licenses_assigned: List[str] = Field(default_factory=lambda: ["Slack", "Google Workspace", "GitHub Enterprise"])
    status: str = "PROVISIONED"

class OnboardingJourneyResponse(BaseModel):
    journey_id: str
    candidate_name: str
    corporate_email: str
    joining_date: str
    status: OnboardingStatusEnum
    assigned_buddy: str = "Elena Rostova (Lead Architect)"
    progress_percentage: float = 65.0
    tasks: List[OnboardingTaskItem]
    ai_risk_score_pct: float = 12.5  # Low risk
    ai_risk_assessment: str = "On track: Preboarding documents verified. IT hardware shipped."

class OnboardingAnalyticsMetrics(BaseModel):
    onboarding_completion_rate_pct: float = 96.5
    average_completion_days: float = 4.2
    it_provisioning_sla_met_pct: float = 98.0
    active_onboarding_journeys: int = 12
