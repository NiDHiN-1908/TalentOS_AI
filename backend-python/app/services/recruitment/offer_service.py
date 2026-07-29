import time
from typing import Dict, Any
from app.domain.recruitment_models import OfferLetterRequest, OfferLetterResponse
from app.services.recruitment.pipeline_service import RecruitmentPipelineService, CandidateStageEnum

class OfferService:
    offers_db: Dict[str, OfferLetterResponse] = {}

    @classmethod
    def generate_offer(cls, req: OfferLetterRequest) -> OfferLetterResponse:
        offer_id = f"OFR-{int(time.time() * 1000)}"
        expires_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() + (72 * 3600)))

        # Update Candidate Stage to OFFER_EXTENDED
        try:
            RecruitmentPipelineService.advance_stage(req.candidate_id, CandidateStageEnum.OFFER_EXTENDED)
        except ValueError:
            pass

        record = OfferLetterResponse(
            offer_id=offer_id,
            candidate_id=req.candidate_id,
            status="EXTENDED",
            base_salary=req.base_salary,
            onboarding_workflow_triggered=False,
            expires_at=expires_at
        )
        cls.offers_db[offer_id] = record
        return record

    @classmethod
    def accept_offer(cls, offer_id: str) -> OfferLetterResponse:
        offer = cls.offers_db.get(offer_id)
        if not offer:
            raise ValueError("Offer ID not found.")

        offer.status = "ACCEPTED"
        offer.onboarding_workflow_triggered = True

        # Advance Candidate Stage to OFFER_ACCEPTED
        try:
            RecruitmentPipelineService.advance_stage(offer.candidate_id, CandidateStageEnum.OFFER_ACCEPTED)
        except ValueError:
            pass

        return offer
