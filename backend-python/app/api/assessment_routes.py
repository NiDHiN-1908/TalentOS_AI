from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.assessment_models import (
    AssessmentTemplateCreate,
    CodeExecutionRequest,
    CodeExecutionResponse,
    ProctoringLogEvent,
    AIEvaluationReport
)
from app.services.assessment_intelligence.assessment_service import AssessmentService
from app.services.assessment_intelligence.ai_evaluator import AIAssessmentEvaluatorService

router = APIRouter(prefix="/assessment", tags=["Enterprise Assessment Intelligence Platform"])

@router.post("/templates/create")
def create_assessment_template(req: AssessmentTemplateCreate):
    return AssessmentService.create_template(req)

@router.post("/code/execute", response_model=CodeExecutionResponse)
def execute_candidate_code(req: CodeExecutionRequest):
    return AssessmentService.execute_code_sandbox(req)

@router.post("/proctoring/log", response_model=ProctoringLogEvent)
def log_proctoring_event(candidate_id: str, assessment_id: str, event_type: str = "TAB_SWITCH_DETECTED"):
    return AssessmentService.log_proctoring_event(candidate_id, assessment_id, event_type)

@router.post("/submissions/evaluate", response_model=AIEvaluationReport)
def evaluate_assessment_submission(assessment_id: str, candidate_id: str):
    return AIAssessmentEvaluatorService.evaluate_submission(assessment_id, candidate_id)
