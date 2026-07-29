from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class AssessmentTypeEnum(str, Enum):
    CODING = "CODING"
    TECHNICAL_MCQ = "TECHNICAL_MCQ"
    SYSTEM_DESIGN_CASE = "SYSTEM_DESIGN_CASE"
    BEHAVIORAL = "BEHAVIORAL"

class CodeExecutionRequest(BaseModel):
    candidate_id: str = Field(..., example="CND-101")
    assessment_id: str = Field(..., example="ASM-101")
    language: str = Field(default="python", example="python")
    code: str = Field(..., example="def solution(n): return n * 2")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class CodeExecutionResponse(BaseModel):
    passed_tests: int = 5
    total_tests: int = 5
    execution_time_ms: int = 14
    memory_used_mb: float = 18.5
    runtime_complexity: str = "O(N)"
    plagiarism_detected: bool = False
    stdout: str = "All test cases passed."

class ProctoringLogEvent(BaseModel):
    candidate_id: str
    assessment_id: str
    event_type: str = Field(..., example="TAB_SWITCH_DETECTED") # TAB_SWITCH_DETECTED / COPY_PASTE_ATTEMPT
    timestamp: str

class AIEvaluationReport(BaseModel):
    assessment_id: str
    candidate_id: str
    overall_score_pct: float = Field(..., example=96.0) # 0-100%
    code_quality_score: float = Field(..., example=98.0)
    skill_competencies: Dict[str, float] = Field(default_factory=dict)
    strengths: List[str]
    weaknesses: List[str]
    hiring_recommendation: str = "STRONG_PASS" # STRONG_PASS / PASS / FAIL
    evaluated_at: str

class AssessmentTemplateCreate(BaseModel):
    title: str = Field(..., example="Senior AI Engineer Coding Assessment")
    assessment_type: AssessmentTypeEnum = AssessmentTypeEnum.CODING
    duration_minutes: int = Field(default=60)
    passing_score_pct: float = Field(default=75.0)
    questions_count: int = Field(default=3)
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")
