from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SkillEntity(BaseModel):
    name: str = Field(..., example="PyTorch")
    category: str = Field(..., example="Machine Learning")
    experience_years: Optional[int] = 4
    confidence_score: float = 0.95

class EmploymentExperience(BaseModel):
    company_name: str
    job_title: str
    duration_months: int
    responsibilities: List[str]
    is_leadership: bool = False

class EducationEntity(BaseModel):
    degree: str
    field_of_study: str
    institution: str
    graduation_year: int

class ParsedResumeModel(BaseModel):
    resume_id: str
    candidate_name: str
    email: str
    skills: List[SkillEntity]
    experience: List[EmploymentExperience]
    education: List[EducationEntity]
    employment_gaps_detected: List[str] = Field(default_factory=list)
    quality_score: float = 94.0

class ResumeParseRequest(BaseModel):
    resume_text: str = Field(..., example="Sarah Chen, AI Architect with 8 years experience in PyTorch and LangGraph...")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class JobMatchRequest(BaseModel):
    resume_text: str
    job_description: str
    required_skills: List[str] = Field(default_factory=list)
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class XAIMatchScoreBreakdown(BaseModel):
    skill_match_pct: float
    experience_match_pct: float
    education_match_pct: float
    domain_fit_pct: float

class JobMatchResponse(BaseModel):
    match_score: float = Field(..., example=96.5)
    score_breakdown: XAIMatchScoreBreakdown
    strengths: List[str]
    skill_gaps: List[str]
    employment_gaps: List[str]
    bias_audit_status: str = "PASSED_ANONYMIZED"

class CandidateRankItem(BaseModel):
    candidate_id: str
    candidate_name: str
    match_score: float
    rank: int
    top_skills: List[str]
