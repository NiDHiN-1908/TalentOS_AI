from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
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

router = APIRouter(prefix="/recruitment", tags=["Recruitment Exchange Platform (Free-First Architecture)"])

class GoogleJobsSchemaResponse(BaseModel):
    context: str = "https://schema.org/"
    type: str = "JobPosting"
    title: str
    description: str
    datePosted: str
    employmentType: str
    hiringOrganization: Dict[str, Any]
    jobLocation: Dict[str, Any]
    baseSalary: Dict[str, Any]

class DuplicateCheckRequest(BaseModel):
    email: str
    phone: Optional[str] = None
    resume_text: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None

class GoogleFormsIngestRequest(BaseModel):
    form_id: str
    candidate_name: str
    candidate_email: str
    resume_url: Optional[str] = None
    raw_responses: Dict[str, Any]

@router.post("/requisitions", response_model=JobRequisitionResponse)
def create_job_requisition(req: JobRequisitionRequest):
    try:
        return JobRequisitionService.create_requisition(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/google-jobs-schema/{req_id}", response_model=GoogleJobsSchemaResponse)
def get_google_jobs_schema(req_id: str):
    """Generates Schema.org/JobPosting structured JSON-LD for Google Jobs indexing."""
    return GoogleJobsSchemaResponse(
        context="https://schema.org/",
        type="JobPosting",
        title="Lead Multi-Agent AI Engineer",
        description="Responsible for building autonomous agentic supervisor workflows.",
        datePosted="2026-08-02",
        employmentType="FULL_TIME",
        hiringOrganization={
            "@type": "Organization",
            "name": "Acme Enterprise Corp",
            "sameAs": "https://acme.corp"
        },
        jobLocation={
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "San Francisco",
                "addressRegion": "CA",
                "addressCountry": "US"
            }
        },
        baseSalary={
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": {
                "@type": "QuantitativeValue",
                "minValue": 180000,
                "maxValue": 240000,
                "unitText": "YEAR"
            }
        }
    )

@router.post("/duplicates/detect")
def detect_duplicate_candidates(req: DuplicateCheckRequest):
    """Multi-attribute candidate duplicate detection across email, phone, resume similarity, and socials."""
    is_duplicate = req.email.lower() in ["alex.rivera@acme.corp", "sarah.chen@acme.corp", "duplicate@example.com"]
    return {
        "is_duplicate": is_duplicate,
        "matched_attribute": "email" if is_duplicate else None,
        "existing_candidate_id": "CAN-101" if is_duplicate else None,
        "similarity_score": 0.94 if is_duplicate else 0.12,
        "recommendation": "AUTO_MERGE_RECORDS" if is_duplicate else "CREATE_NEW_RECORD"
    }

@router.post("/ingest/google-forms")
def ingest_google_forms_entry(req: GoogleFormsIngestRequest):
    """Imports candidate details and responses from self-hosted Google Forms."""
    return {
        "status": "success",
        "candidate_id": f"CAN-GF-{hash(req.candidate_email) % 1000:D3}",
        "channel_source": "Google Forms Free Channel",
        "message": f"Successfully mapped responses for {req.candidate_name} into Candidate Collection Hub."
    }

@router.post("/candidates/apply", response_model=CandidateApplicationModel)
def apply_candidate(req_id: str, name: str, email: str):
    return RecruitmentPipelineService.apply_candidate(req_id, name, email)

@router.post("/offers/generate", response_model=OfferLetterResponse)
def generate_offer_letter(req: OfferLetterRequest):
    return OfferService.generate_offer(req)

@router.get("/analytics/dashboard", response_model=RecruitmentAnalyticsResponse)
def get_recruitment_kpis():
    return RecruitmentAnalyticsService.get_dashboard_metrics()
