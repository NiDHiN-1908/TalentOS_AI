from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.candidate_models import (
    JobDiscoveryQuery,
    JobListingItem,
    CandidateProfileModel,
    QuickApplyRequest,
    CandidateApplicationStatusResponse,
    ESignOfferRequest
)
from app.services.candidate_portal.candidate_service import CandidatePortalService

router = APIRouter(prefix="/candidate", tags=["Candidate Experience Platform"])

@router.post("/jobs/search", response_model=List[JobListingItem])
def search_jobs(query: JobDiscoveryQuery):
    return CandidatePortalService.search_jobs(query)

@router.get("/profile", response_model=CandidateProfileModel)
def get_candidate_profile(email: str = "sarah.chen@talentos.ai"):
    return CandidatePortalService.get_candidate_profile(email)

@router.post("/applications/apply", response_model=CandidateApplicationStatusResponse)
def quick_apply(req: QuickApplyRequest):
    return CandidatePortalService.quick_apply(req)

@router.get("/applications/status", response_model=List[CandidateApplicationStatusResponse])
def get_application_statuses():
    return list(CandidatePortalService.applications_db.values()) or [
        CandidateApplicationStatusResponse(
            application_id="APP-801",
            job_id="JOB-101",
            job_title="Principal AI Architect",
            status="INTERVIEW_SCHEDULED",
            applied_date="2026-07-28",
            next_step="Panel Technical Interview with CTO"
        )
    ]

@router.post("/offers/sign")
def esign_candidate_offer(req: ESignOfferRequest):
    return CandidatePortalService.esign_offer(req)
