from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from enum import Enum

class RequisitionStatusEnum(str, Enum):
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    OPEN = "OPEN"
    FILLED = "FILLED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"

class CandidateStageEnum(str, Enum):
    APPLIED = "APPLIED"
    SCREENING = "SCREENING"
    INTERVIEW = "INTERVIEW"
    ASSESSMENT = "ASSESSMENT"
    OFFER_PENDING = "OFFER_PENDING"
    OFFER_EXTENDED = "OFFER_EXTENDED"
    OFFER_ACCEPTED = "OFFER_ACCEPTED"
    REJECTED = "REJECTED"

class JobRequisitionRequest(BaseModel):
    title: str = Field(..., example="Principal AI Architect")
    department: str = Field(..., example="Engineering")
    headcount: int = Field(default=1)
    min_salary: float = Field(..., example=180000)
    max_salary: float = Field(..., example=240000)
    hiring_manager_id: str = Field(..., example="USR-101")
    recruiter_id: str = Field(..., example="USR-102")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class JobRequisitionResponse(BaseModel):
    req_id: str
    title: str
    department: str
    headcount: int
    salary_range: str
    status: RequisitionStatusEnum
    hiring_manager_id: str
    created_at: str

class CandidateApplicationModel(BaseModel):
    candidate_id: str
    req_id: str
    candidate_name: str
    email: EmailStr
    stage: CandidateStageEnum = CandidateStageEnum.APPLIED
    match_score: float = 94.5
    created_at: str

class OfferLetterRequest(BaseModel):
    candidate_id: str
    req_id: str
    base_salary: float = Field(..., example=210000)
    signing_bonus: Optional[float] = Field(default=25000)
    start_date: str = Field(..., example="2026-09-01")
    approver_id: str = Field(default="USR-101")

class OfferLetterResponse(BaseModel):
    offer_id: str
    candidate_id: str
    status: str = "EXTENDED"
    base_salary: float
    onboarding_workflow_triggered: bool = False
    expires_at: str

class RecruitmentAnalyticsResponse(BaseModel):
    time_to_hire_days: float = 24.5
    time_to_fill_days: float = 32.0
    offer_acceptance_rate_pct: float = 88.5
    active_requisitions_count: int = 14
    total_candidates_in_pipeline: int = 142
    cost_per_hire_usd: float = 4200.0
