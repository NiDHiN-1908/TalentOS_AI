import time
from typing import Dict, Any, List, Optional
from app.domain.ats_models import (
    ATSCandidateProfile,
    ATSSearchQuery,
    BulkStageTransitionRequest,
    InterviewScorecardSubmission,
    ScorecardResponse,
    RecruiterWorkspaceMetrics,
    ATSStageEnum
)

class EnterpriseATSService:
    candidates_db: Dict[str, ATSCandidateProfile] = {}
    scorecards_db: List[ScorecardResponse] = []
    candidate_stages_db: Dict[str, ATSStageEnum] = {}

    @classmethod
    def create_candidate(cls, name: str, email: str, phone: str, title: str, skills: List[str], exp_years: int) -> ATSCandidateProfile:
        cid = f"ATS-CND-{int(time.time() * 1000)}"
        
        # Check duplicate candidate email
        is_dup = any(c.email == email for c in cls.candidates_db.values())
        dup_of = next((c.candidate_id for c in cls.candidates_db.values() if c.email == email), None)

        record = ATSCandidateProfile(
            candidate_id=cid,
            full_name=name,
            email=email,
            phone=phone,
            current_title=title,
            skills=skills,
            experience_years=exp_years,
            tags=["AI", "Senior"] if exp_years >= 5 else ["Junior"],
            is_duplicate=is_dup,
            duplicate_of_id=dup_of,
            created_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
        cls.candidates_db[cid] = record
        cls.candidate_stages_db[cid] = ATSStageEnum.NEW_APPLICATION
        return record

    @classmethod
    def search_candidates(cls, query: ATSSearchQuery) -> List[ATSCandidateProfile]:
        cls._ensure_defaults()
        q_lower = query.query.lower()
        results: List[ATSCandidateProfile] = []

        for candidate in cls.candidates_db.values():
            if candidate.experience_years >= (query.min_experience_years or 0):
                if q_lower in candidate.full_name.lower() or q_lower in candidate.current_title.lower() or any(q_lower in s.lower() for s in candidate.skills):
                    results.append(candidate)

        return results if results else list(cls.candidates_db.values())

    @classmethod
    def bulk_stage_transition(cls, req: BulkStageTransitionRequest) -> Dict[str, Any]:
        transitioned_count = 0
        for cid in req.candidate_ids:
            if cid in cls.candidates_db:
                cls.candidate_stages_db[cid] = req.target_stage
                transitioned_count += 1

        return {
            "req_id": req.req_id,
            "target_stage": req.target_stage.value,
            "transitioned_candidates_count": transitioned_count,
            "status": "SUCCESS"
        }

    @classmethod
    def submit_scorecard(cls, sub: InterviewScorecardSubmission) -> ScorecardResponse:
        sc_id = f"SCR-{int(time.time() * 1000)}"
        avg_score = round((sub.technical_rating + sub.architecture_rating + sub.culture_fit_rating) / 3.0, 1)

        response = ScorecardResponse(
            scorecard_id=sc_id,
            candidate_id=sub.candidate_id,
            average_score=avg_score,
            overall_recommendation=sub.overall_recommendation,
            submitted_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
        cls.scorecards_db.append(response)
        return response

    @classmethod
    def get_recruiter_workspace_metrics(cls) -> RecruiterWorkspaceMetrics:
        return RecruiterWorkspaceMetrics(
            assigned_requisitions_count=6,
            active_candidates_managed=len(cls.candidates_db) or 48,
            pending_scorecards_count=len(cls.scorecards_db),
            daily_interviews_scheduled=4,
            sla_breached_candidates_count=1
        )

    @classmethod
    def _ensure_defaults(cls):
        if cls.candidates_db:
            return
        cls.create_candidate(
            name="Sarah Chen",
            email="sarah.chen@talentos.ai",
            phone="+1 (415) 555-2671",
            title="Principal AI Architect",
            skills=["Python", "LangGraph", "PyTorch", "FastAPI"],
            exp_years=8
        )
        cls.create_candidate(
            name="Alex Rivera",
            email="alex.rivera@talentos.ai",
            phone="+1 (212) 555-9812",
            title="Lead Frontend Engineer",
            skills=["TypeScript", "React", "TailwindCSS"],
            exp_years=6
        )
