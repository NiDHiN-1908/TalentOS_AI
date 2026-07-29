from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from enum import Enum

class ATSStageEnum(str, Enum):
    NEW_APPLICATION = "NEW_APPLICATION"
    RECRUITER_SCREEN = "RECRUITER_SCREEN"
    HM_REVIEW = "HM_REVIEW"
    TECHNICAL_INTERVIEW = "TECHNICAL_INTERVIEW"
    SYSTEM_DESIGN = "SYSTEM_DESIGN"
    CULTURE_FIT = "CULTURE_FIT"
    OFFER_PENDING = "OFFER_PENDING"
    OFFER_ACCEPTED = "OFFER_ACCEPTED"
    REJECTED = "REJECTED"

class ATSCandidateProfile(BaseModel):
    candidate_id: str
    full_name: str
    email: EmailStr
    phone: str
    current_title: str
    skills: List[str]
    experience_years: int
    tags: List[str] = Field(default_factory=list)
    is_duplicate: bool = False
    duplicate_of_id: Optional[str] = None
    created_at: str

class ATSSearchQuery(BaseModel):
    query: str = Field(..., example="Python LangGraph Architect")
    skills: Optional[List[str]] = None
    min_experience_years: Optional[int] = 0
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class BulkStageTransitionRequest(BaseModel):
    candidate_ids: List[str]
    req_id: str
    target_stage: ATSStageEnum
    reason: Optional[str] = None

class InterviewScorecardSubmission(BaseModel):
    candidate_id: str
    req_id: str
    interviewer_id: str
    interviewer_name: str
    technical_rating: int = Field(..., ge=1, le=5)
    architecture_rating: int = Field(..., ge=1, le=5)
    culture_fit_rating: int = Field(..., ge=1, le=5)
    overall_recommendation: str = Field(..., example="STRONG_HIRE") # STRONG_HIRE / HIRE / NO_HIRE
    written_feedback: str

class ScorecardResponse(BaseModel):
    scorecard_id: str
    candidate_id: str
    average_score: float
    overall_recommendation: str
    submitted_at: str

class RecruiterWorkspaceMetrics(BaseModel):
    assigned_requisitions_count: int = 6
    active_candidates_managed: int = 48
    pending_scorecards_count: int = 3
    daily_interviews_scheduled: int = 4
    sla_breached_candidates_count: int = 1
