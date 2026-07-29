from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.performance_models import (
    OKRCreateRequest,
    OKRProgressUpdate,
    Feedback360Submission,
    NineBoxGridClassification,
    AIPromotionReadinessAnalysis
)
from app.services.performance_intelligence.performance_service import PerformanceService
from app.services.performance_intelligence.ai_performance_advisor import AIPerformanceAdvisorService

router = APIRouter(prefix="/performance", tags=["Enterprise Performance Management Intelligence Platform"])

@router.post("/okrs/create")
def create_okr(req: OKRCreateRequest):
    return PerformanceService.create_okr(req)

@router.post("/okrs/update-progress")
def update_okr_progress(req: OKRProgressUpdate):
    try:
        return PerformanceService.update_okr_progress(req)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/feedback/submit")
def submit_360_feedback(sub: Feedback360Submission):
    return PerformanceService.submit_360_feedback(sub)

@router.get("/grid/9box", response_model=NineBoxGridClassification)
def get_9box_grid_classification(employee_id: str = "EMP-101"):
    return PerformanceService.classify_9box_grid(employee_id)

@router.get("/ai/promotion-readiness", response_model=AIPromotionReadinessAnalysis)
def get_ai_promotion_readiness(employee_id: str = "EMP-101"):
    return AIPerformanceAdvisorService.analyze_promotion_readiness(employee_id)
