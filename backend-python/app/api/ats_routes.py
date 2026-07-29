from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.ats_models import (
    ATSCandidateProfile,
    ATSSearchQuery,
    BulkStageTransitionRequest,
    InterviewScorecardSubmission,
    ScorecardResponse,
    RecruiterWorkspaceMetrics
)
from app.services.ats.ats_service import EnterpriseATSService

router = APIRouter(prefix="/ats", tags=["Enterprise Applicant Tracking System"])

@router.post("/candidates", response_model=ATSCandidateProfile)
def create_ats_candidate(name: str, email: str, phone: str, title: str, skills: List[str], exp_years: int):
    return EnterpriseATSService.create_candidate(name, email, phone, title, skills, exp_years)

@router.post("/candidates/search", response_model=List[ATSCandidateProfile])
def search_ats_candidates(query: ATSSearchQuery):
    return EnterpriseATSService.search_candidates(query)

@router.post("/pipeline/bulk-transition")
def bulk_stage_transition(req: BulkStageTransitionRequest):
    return EnterpriseATSService.bulk_stage_transition(req)

@router.post("/scorecards/submit", response_model=ScorecardResponse)
def submit_interview_scorecard(sub: InterviewScorecardSubmission):
    return EnterpriseATSService.submit_scorecard(sub)

@router.get("/workspaces/recruiter", response_model=RecruiterWorkspaceMetrics)
def get_recruiter_workspace_metrics():
    return EnterpriseATSService.get_recruiter_workspace_metrics()
