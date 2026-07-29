from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.recruitment_models import (
    JobRequisitionRequest,
    JobRequisitionResponse,
    CandidateApplicationModel,
    CandidateStageEnum,
    OfferLetterRequest,
    OfferLetterResponse,
    RecruitmentAnalyticsResponse
)
from app.services.recruitment.requisition_service import JobRequisitionService
from app.services.recruitment.pipeline_service import RecruitmentPipelineService
from app.services.recruitment.offer_service import OfferService
from app.services.recruitment.recruitment_analytics import RecruitmentAnalyticsService

router = APIRouter(prefix="/recruitment", tags=["Recruitment Intelligence Platform"])

@router.post("/requisitions", response_model=JobRequisitionResponse)
def create_job_requisition(req: JobRequisitionRequest):
    try:
        return JobRequisitionService.create_requisition(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/requisitions/{req_id}/approve", response_model=JobRequisitionResponse)
def approve_job_requisition(req_id: str, approver_id: str = "USR-101"):
    try:
        return JobRequisitionService.approve_requisition(req_id, approver_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/candidates/apply", response_model=CandidateApplicationModel)
def apply_candidate(req_id: str, name: str, email: str):
    return RecruitmentPipelineService.apply_candidate(req_id, name, email)

@router.post("/candidates/{candidate_id}/stage", response_model=CandidateApplicationModel)
def advance_candidate_stage(candidate_id: str, stage: CandidateStageEnum):
    try:
        return RecruitmentPipelineService.advance_stage(candidate_id, stage)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/offers/generate", response_model=OfferLetterResponse)
def generate_offer_letter(req: OfferLetterRequest):
    return OfferService.generate_offer(req)

@router.post("/offers/{offer_id}/accept", response_model=OfferLetterResponse)
def accept_offer_letter(offer_id: str):
    try:
        return OfferService.accept_offer(offer_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/analytics/dashboard", response_model=RecruitmentAnalyticsResponse)
def get_recruitment_kpis():
    return RecruitmentAnalyticsService.get_dashboard_metrics()
