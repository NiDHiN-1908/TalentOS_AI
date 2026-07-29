from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.onboarding_models import (
    PreboardingSubmissionRequest,
    OnboardingJourneyResponse,
    ITProvisioningResult,
    OnboardingAnalyticsMetrics
)
from app.services.onboarding.onboarding_service import OnboardingService

router = APIRouter(prefix="/onboarding", tags=["Enterprise Employee Onboarding Platform"])

@router.post("/journeys/start", response_model=OnboardingJourneyResponse)
def start_onboarding_journey(req: PreboardingSubmissionRequest):
    try:
        return OnboardingService.start_onboarding_journey(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/provisioning/execute", response_model=ITProvisioningResult)
def execute_it_provisioning(candidate_name: str = "Sarah Chen"):
    return OnboardingService.execute_it_provisioning(candidate_name)

@router.post("/tasks/complete", response_model=OnboardingJourneyResponse)
def complete_onboarding_task(journey_id: str, task_id: str):
    try:
        return OnboardingService.complete_task(journey_id, task_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/analytics/metrics", response_model=OnboardingAnalyticsMetrics)
def get_onboarding_metrics():
    return OnboardingService.get_analytics_metrics()
