from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class ContentFormatEnum(str, Enum):
    SCORM_2004 = "SCORM_2004"
    XAPI = "XAPI"
    MICROLEARNING_VIDEO = "MICROLEARNING_VIDEO"
    INTERACTIVE_LAB = "INTERACTIVE_LAB"
    DOCUMENT = "DOCUMENT"

class CourseCreateRequest(BaseModel):
    title: str = Field(..., example="Advanced LangGraph Multi-Agent Architecture")
    description: str = Field(..., example="Master stateful multi-agent supervisor graphs in Python.")
    format_type: ContentFormatEnum = ContentFormatEnum.MICROLEARNING_VIDEO
    duration_minutes: int = Field(default=45)
    skills_covered: List[str] = Field(default_factory=lambda: ["LangGraph", "Python", "Multi-Agent Systems"])
    target_skill_level: int = Field(default=4, ge=1, le=5)
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class CourseEnrollmentResponse(BaseModel):
    enrollment_id: str
    employee_id: str
    course_id: str
    status: str = "ENROLLED" # ENROLLED / IN_PROGRESS / COMPLETED
    progress_pct: float = 0.0
    enrolled_at: str

class DigitalCertificateResponse(BaseModel):
    certificate_id: str
    employee_id: str
    employee_name: str
    course_title: str
    issued_date: str
    expiry_date: str
    verification_hash: str
    skills_validated: List[str]

class AILearningPathRecommendation(BaseModel):
    employee_id: str
    target_role: str = Field(default="Principal AI Architect")
    recommended_courses: List[Dict[str, Any]]
    skill_gap_summary: List[str]
    estimated_weeks_to_completion: int = 6

class LearningAnalyticsMetrics(BaseModel):
    learning_completion_rate_pct: float = 91.2
    skill_growth_velocity_score: float = 8.4  # out of 10
    compliance_certification_rate_pct: float = 98.5
    active_learners_count: int = 420
    learning_hours_delivered_month: float = 1240.0
