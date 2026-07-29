from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class NineBoxCategoryEnum(str, Enum):
    STAR = "STAR"
    HIGH_PERFORMER = "HIGH_PERFORMER"
    HIGH_POTENTIAL = "HIGH_POTENTIAL"
    SOLID_CONTRIBUTOR = "SOLID_CONTRIBUTOR"
    UNDERPERFORMER = "UNDERPERFORMER"

class OKRCreateRequest(BaseModel):
    employee_id: str = Field(..., example="EMP-101")
    title: str = Field(..., example="Architect & Scale Multi-Agent LangGraph System")
    objective: str = Field(..., example="Deliver zero-downtime microservice orchestration.")
    key_results: List[str] = Field(..., example=["Achieve 99.9% uptime", "Reduce p99 latency to < 100ms"])
    target_date: str = Field(..., example="2026-12-31")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class OKRProgressUpdate(BaseModel):
    okr_id: str
    progress_percentage: float = Field(..., example=85.0)
    status_notes: str

class Feedback360Submission(BaseModel):
    employee_id: str
    reviewer_id: str
    reviewer_role: str = Field(..., example="PEER") # MANAGER / PEER / DIRECT_REPORT / SELF
    technical_rating: int = Field(..., ge=1, le=5)
    leadership_rating: int = Field(..., ge=1, le=5)
    collaboration_rating: int = Field(..., ge=1, le=5)
    written_feedback: str

class NineBoxGridClassification(BaseModel):
    employee_id: str
    performance_score: float = Field(..., example=4.8) # 1-5
    potential_score: float = Field(..., example=4.9)   # 1-5
    nine_box_category: NineBoxCategoryEnum = NineBoxCategoryEnum.STAR
    recommendation: str = "Fast-track promotion to VP / Principal level."

class AIPromotionReadinessAnalysis(BaseModel):
    employee_id: str
    promotion_readiness_score: float = Field(..., example=92.4) # 0-100%
    ready_for_role: str = Field(default="VP of AI Engineering")
    readiness_status: str = Field(default="READY_NOW")
    burnout_risk_level: str = Field(default="LOW")
    key_strengths: List[str]
    development_focus_areas: List[str]
    justification_summary: str
