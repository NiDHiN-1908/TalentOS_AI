from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from enum import Enum

class CandidateAppStatusEnum(str, Enum):
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    SHORTLISTED = "SHORTLISTED"
    INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED"
    ASSESSMENT_PENDING = "ASSESSMENT_PENDING"
    OFFER_ISSUED = "OFFER_ISSUED"
    OFFER_ACCEPTED = "OFFER_ACCEPTED"
    REJECTED = "REJECTED"

class JobDiscoveryQuery(BaseModel):
    query: Optional[str] = Field(default="")
    department: Optional[str] = None
    location: Optional[str] = None
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class JobListingItem(BaseModel):
    job_id: str
    title: str
    department: str
    location: str
    salary_range: str
    match_score: float = 95.0
    description: str

class CandidateProfileModel(BaseModel):
    candidate_id: str
    full_name: str
    email: EmailStr
    phone: str
    skills: List[str]
    experience_years: int
    completeness_score: float = 85.0
    ai_suggestions: List[str]

class QuickApplyRequest(BaseModel):
    job_id: str
    full_name: str
    email: EmailStr
    resume_text: str
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class CandidateApplicationStatusResponse(BaseModel):
    application_id: str
    job_id: str
    job_title: str
    status: CandidateAppStatusEnum
    applied_date: str
    next_step: str

class ESignOfferRequest(BaseModel):
    offer_id: str
    candidate_signature: str = Field(..., example="Sarah Chen")
    accept_terms: bool = True
