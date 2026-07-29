import time
from typing import Dict, Any, List, Optional
from app.domain.offer_models import (
    OfferCreateRequest,
    OfferEInterfaceResponse,
    OfferStatusEnum,
    OfferApprovalAction,
    CounterOfferRequest,
    OfferAnalyticsMetrics
)

class OfferService:
    offers_db: Dict[str, OfferEInterfaceResponse] = {}

    @classmethod
    def create_offer(cls, req: OfferCreateRequest) -> OfferEInterfaceResponse:
        offer_id = f"OFR-{int(time.time() * 1000)}"
        total_first_yr = req.base_salary + req.signing_bonus + req.relocation_stipend
        expires_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() + (72 * 3600)))

        record = OfferEInterfaceResponse(
            offer_id=offer_id,
            candidate_name=req.candidate_name,
            job_title=req.job_title,
            status=OfferStatusEnum.PENDING_APPROVAL,
            base_salary=req.base_salary,
            signing_bonus=req.signing_bonus,
            total_comp_first_year=total_first_yr,
            onboarding_workflow_triggered=False,
            expires_at=expires_at
        )
        cls.offers_db[offer_id] = record
        return record

    @classmethod
    def approve_offer(cls, action: OfferApprovalAction) -> OfferEInterfaceResponse:
        offer = cls.offers_db.get(action.offer_id)
        if not offer:
            raise ValueError("Offer ID not found.")

        if action.action.upper() == "APPROVE":
            offer.status = OfferStatusEnum.EXTENDED
        else:
            offer.status = OfferStatusEnum.OFFER_DECLINED

        return offer

    @classmethod
    def process_counter_offer(cls, req: CounterOfferRequest) -> OfferEInterfaceResponse:
        offer = cls.offers_db.get(req.offer_id)
        if not offer:
            raise ValueError("Offer ID not found.")

        # Hard cap check: +10% max counter increase
        max_allowed = offer.base_salary * 1.10
        if req.proposed_base_salary > max_allowed:
            raise ValueError(f"Counter offer base salary (${req.proposed_base_salary:,.2f}) exceeds maximum 10% policy threshold (${max_allowed:,.2f}). Requires C-suite exception approval.")

        offer.base_salary = req.proposed_base_salary
        offer.signing_bonus = req.proposed_signing_bonus
        offer.status = OfferStatusEnum.UNDER_NEGOTIATION
        return offer

    @classmethod
    def esign_offer(cls, offer_id: str, candidate_signature: str) -> OfferEInterfaceResponse:
        offer = cls.offers_db.get(offer_id)
        if not offer:
            raise ValueError("Offer ID not found.")

        offer.status = OfferStatusEnum.OFFER_ACCEPTED
        offer.onboarding_workflow_triggered = True
        return offer

    @classmethod
    def get_analytics_metrics(cls) -> OfferAnalyticsMetrics:
        return OfferAnalyticsMetrics(
            offer_acceptance_rate_pct=88.5,
            average_negotiation_rate_pct=14.2,
            time_to_offer_days=4.2,
            active_offers_count=len(cls.offers_db) or 8,
            budget_utilization_pct=92.4
        )
