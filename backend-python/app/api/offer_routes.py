from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.offer_models import (
    OfferCreateRequest,
    OfferEInterfaceResponse,
    CompensationRecommendationResponse,
    OfferApprovalAction,
    CounterOfferRequest,
    OfferAnalyticsMetrics
)
from app.services.offer_intelligence.offer_service import OfferService
from app.services.offer_intelligence.ai_compensation_advisor import AICompensationAdvisorService

router = APIRouter(prefix="/offer", tags=["Enterprise Offer Intelligence Platform"])

@router.post("/create", response_model=OfferEInterfaceResponse)
def create_offer(req: OfferCreateRequest):
    try:
        return OfferService.create_offer(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recommend-compensation", response_model=CompensationRecommendationResponse)
def recommend_compensation(job_title: str = "Principal AI Architect", department: str = "Engineering", exp_years: int = 8):
    return AICompensationAdvisorService.recommend_compensation(job_title, department, exp_years)

@router.post("/approve", response_model=OfferEInterfaceResponse)
def approve_offer(action: OfferApprovalAction):
    try:
        return OfferService.approve_offer(action)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/negotiate", response_model=OfferEInterfaceResponse)
def process_counter_offer(req: CounterOfferRequest):
    try:
        return OfferService.process_counter_offer(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{offer_id}/esign", response_model=OfferEInterfaceResponse)
def esign_offer(offer_id: str, candidate_signature: str = "Sarah Chen"):
    try:
        return OfferService.esign_offer(offer_id, candidate_signature)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/analytics", response_model=OfferAnalyticsMetrics)
def get_offer_analytics():
    return OfferService.get_analytics_metrics()
