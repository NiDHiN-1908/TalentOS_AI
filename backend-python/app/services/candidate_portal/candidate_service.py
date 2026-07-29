import time
from typing import Dict, Any, List, Optional
from app.domain.candidate_models import (
    JobDiscoveryQuery,
    JobListingItem,
    CandidateProfileModel,
    QuickApplyRequest,
    CandidateApplicationStatusResponse,
    CandidateAppStatusEnum,
    ESignOfferRequest
)

class CandidatePortalService:
    applications_db: Dict[str, CandidateApplicationStatusResponse] = {}

    @classmethod
    def search_jobs(cls, query: JobDiscoveryQuery) -> List[JobListingItem]:
        jobs = [
            JobListingItem(
                job_id="JOB-101",
                title="Principal AI Architect",
                department="Engineering",
                location="San Francisco, CA (Hybrid)",
                salary_range="$210,000 - $260,000",
                match_score=96.5,
                description="Lead agentic AI system architecture for TalentOS AI."
            ),
            JobListingItem(
                job_id="JOB-102",
                title="Lead Frontend UX Engineer",
                department="Design & Product",
                location="Remote",
                salary_range="$170,000 - $210,000",
                match_score=92.0,
                description="Build modern accessible design systems in React & TypeScript."
            ),
            JobListingItem(
                job_id="JOB-103",
                title="Senior Data Platform Engineer",
                department="Data Science",
                location="New York, NY",
                salary_range="$185,000 - $225,000",
                match_score=88.0,
                description="Scale distributed vector search and pgvector indexing."
            )
        ]

        if query.query:
            q_lower = query.query.lower()
            return [j for j in jobs if q_lower in j.title.lower() or q_lower in j.department.lower()]
        return jobs

    @classmethod
    def get_candidate_profile(cls, email: str) -> CandidateProfileModel:
        return CandidateProfileModel(
            candidate_id="CND-101",
            full_name="Sarah Chen",
            email=email,
            phone="+1 (415) 555-2671",
            skills=["PyTorch", "TypeScript", "LangGraph", "FastAPI", "React"],
            experience_years=8,
            completeness_score=92.0,
            ai_suggestions=[
                "Add your recent AWS Solutions Architect certification to boost matching score by +5%",
                "Include project repository URL for distributed vector search"
            ]
        )

    @classmethod
    def quick_apply(cls, req: QuickApplyRequest) -> CandidateApplicationStatusResponse:
        app_id = f"APP-{int(time.time() * 1000)}"
        record = CandidateApplicationStatusResponse(
            application_id=app_id,
            job_id=req.job_id,
            job_title="Principal AI Architect" if req.job_id == "JOB-101" else "Lead Engineer",
            status=CandidateAppStatusEnum.SUBMITTED,
            applied_date=time.strftime("%Y-%m-%d", time.gmtime()),
            next_step="Recruiter screening in progress (SLA: 48 hours)"
        )
        cls.applications_db[app_id] = record
        return record

    @classmethod
    def esign_offer(cls, req: ESignOfferRequest) -> Dict[str, Any]:
        return {
            "offer_id": req.offer_id,
            "signature": req.candidate_signature,
            "status": "OFFER_ACCEPTED",
            "signed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "onboarding_status": "TRIGGERED"
        }
