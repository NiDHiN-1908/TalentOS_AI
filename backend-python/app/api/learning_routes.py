from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.learning_models import (
    CourseCreateRequest,
    CourseEnrollmentResponse,
    DigitalCertificateResponse,
    AILearningPathRecommendation,
    LearningAnalyticsMetrics
)
from app.services.learning_intelligence.learning_service import LearningService
from app.services.learning_intelligence.ai_learning_advisor import AILearningAdvisorService

router = APIRouter(prefix="/learning", tags=["Enterprise Learning Intelligence Platform"])

@router.post("/courses/create")
def create_course(req: CourseCreateRequest):
    return LearningService.create_course(req)

@router.post("/enroll", response_model=CourseEnrollmentResponse)
def enroll_employee(employee_id: str = "EMP-101", course_id: str = "CRS-101"):
    return LearningService.enroll_employee(employee_id, course_id)

@router.get("/paths/recommend", response_model=AILearningPathRecommendation)
def recommend_learning_path(employee_id: str = "EMP-101", target_role: str = "Principal AI Architect"):
    return AILearningAdvisorService.recommend_learning_path(employee_id, target_role)

@router.post("/certificates/issue", response_model=DigitalCertificateResponse)
def issue_digital_certificate(employee_id: str = "EMP-101", course_title: str = "Advanced LangGraph Multi-Agent Architecture"):
    return LearningService.issue_certificate(employee_id, course_title)

@router.get("/analytics/dashboard", response_model=LearningAnalyticsMetrics)
def get_learning_analytics():
    return LearningService.get_analytics_metrics()
