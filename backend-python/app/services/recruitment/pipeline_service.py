import time
from typing import Dict, Any, List
from app.domain.recruitment_models import CandidateApplicationModel, CandidateStageEnum

class RecruitmentPipelineService:
    candidates_db: Dict[str, CandidateApplicationModel] = {}

    @classmethod
    def apply_candidate(cls, req_id: str, name: str, email: str) -> CandidateApplicationModel:
        cid = f"CND-{int(time.time() * 1000)}"
        record = CandidateApplicationModel(
            candidate_id=cid,
            req_id=req_id,
            candidate_name=name,
            email=email,
            stage=CandidateStageEnum.APPLIED,
            match_score=94.5,
            created_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
        cls.candidates_db[cid] = record
        return record

    @classmethod
    def advance_stage(cls, candidate_id: str, new_stage: CandidateStageEnum) -> CandidateApplicationModel:
        record = cls.candidates_db.get(candidate_id)
        if not record:
            raise ValueError("Candidate not found.")
        record.stage = new_stage
        return record
