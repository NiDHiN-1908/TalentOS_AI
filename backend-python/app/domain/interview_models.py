from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from enum import Enum

class InterviewTypeEnum(str, Enum):
    TECHNICAL = "TECHNICAL"
    HR = "HR"
    BEHAVIORAL = "BEHAVIORAL"
    MANAGERIAL = "MANAGERIAL"
    SYSTEM_DESIGN = "SYSTEM_DESIGN"
    EXECUTIVE = "EXECUTIVE"

class InterviewStatusEnum(str, Enum):
    SCHEDULED = "SCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    RESCHEDULED = "RESCHEDULED"

class ScheduleInterviewRequest(BaseModel):
    candidate_id: str = Field(..., example="CND-101")
    req_id: str = Field(..., example="REQ-101")
    interview_type: InterviewTypeEnum = InterviewTypeEnum.TECHNICAL
    interviewer_ids: List[str] = Field(default_factory=lambda: ["USR-101", "USR-102"])
    scheduled_time: str = Field(..., example="2026-08-05T14:00:00Z")
    duration_minutes: int = Field(default=60)
    time_zone: str = Field(default="America/Los_Angeles")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class InterviewSessionResponse(BaseModel):
    session_id: str
    candidate_id: str
    interview_type: InterviewTypeEnum
    status: InterviewStatusEnum
    scheduled_time: str
    video_meeting_url: str
    interviewer_names: List[str]

class QuestionItem(BaseModel):
    question_id: str
    category: str
    question_text: str
    evaluation_rubric: str
    difficulty: str = "MEDIUM"

class InterviewPrepBriefing(BaseModel):
    candidate_name: str
    job_title: str
    candidate_strengths: List[str]
    skill_gaps: List[str]
    suggested_questions: List[QuestionItem]
    focus_areas: List[str]

class DetailedScorecardSubmission(BaseModel):
    session_id: str
    candidate_id: str
    interviewer_id: str
    technical_score: int = Field(..., ge=1, le=5)
    problem_solving_score: int = Field(..., ge=1, le=5)
    communication_score: int = Field(..., ge=1, le=5)
    leadership_score: int = Field(..., ge=1, le=5)
    written_notes: str

class HiringConfidenceAnalysis(BaseModel):
    candidate_id: str
    hiring_confidence_score: float = Field(..., example=92.5) # 0-100%
    overall_recommendation: str = "STRONG_HIRE"
    panel_bias_warning: bool = False
    bias_details: Optional[str] = None
    justification_summary: str
