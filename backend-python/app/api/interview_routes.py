from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.interview_models import (
    ScheduleInterviewRequest,
    InterviewSessionResponse,
    QuestionItem,
    InterviewPrepBriefing,
    DetailedScorecardSubmission,
    HiringConfidenceAnalysis
)
from app.services.interview_intelligence.interview_service import InterviewService
from app.services.interview_intelligence.ai_interview_assistant import AIInterviewAssistantService

router = APIRouter(prefix="/interview", tags=["Enterprise Interview Intelligence Platform"])

@router.post("/sessions/schedule", response_model=InterviewSessionResponse)
def schedule_interview_session(req: ScheduleInterviewRequest):
    try:
        return InterviewService.schedule_interview(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/questions/bank", response_model=List[QuestionItem])
def get_question_bank(category: str = "TECHNICAL"):
    return InterviewService.get_question_bank(category)

@router.get("/assistant/prep-brief", response_model=InterviewPrepBriefing)
def get_ai_prep_briefing(candidate_id: str = "CND-101"):
    return AIInterviewAssistantService.generate_prep_briefing(candidate_id)

@router.post("/scorecards/submit")
def submit_detailed_scorecard(sub: DetailedScorecardSubmission):
    return InterviewService.submit_detailed_scorecard(sub)

@router.get("/analytics/confidence", response_model=HiringConfidenceAnalysis)
def get_hiring_confidence_analysis(candidate_id: str = "CND-101"):
    return AIInterviewAssistantService.analyze_hiring_confidence(candidate_id)
