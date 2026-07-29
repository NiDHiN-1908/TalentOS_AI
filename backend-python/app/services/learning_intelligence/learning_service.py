import time
import hashlib
from typing import Dict, Any, List
from app.domain.learning_models import (
    CourseCreateRequest,
    CourseEnrollmentResponse,
    DigitalCertificateResponse,
    LearningAnalyticsMetrics
)

class LearningService:
    courses_db: Dict[str, Dict[str, Any]] = {}
    enrollments_db: Dict[str, CourseEnrollmentResponse] = {}

    @classmethod
    def create_course(cls, req: CourseCreateRequest) -> Dict[str, Any]:
        crs_id = f"CRS-{int(time.time() * 1000)}"
        record = {
            "course_id": crs_id,
            "title": req.title,
            "description": req.description,
            "format_type": req.format_type.value,
            "duration_minutes": req.duration_minutes,
            "skills_covered": req.skills_covered,
            "target_skill_level": req.target_skill_level,
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        cls.courses_db[crs_id] = record
        return record

    @classmethod
    def enroll_employee(cls, employee_id: str, course_id: str) -> CourseEnrollmentResponse:
        enr_id = f"ENR-{int(time.time() * 1000)}"
        record = CourseEnrollmentResponse(
            enrollment_id=enr_id,
            employee_id=employee_id,
            course_id=course_id,
            status="ENROLLED",
            progress_pct=0.0,
            enrolled_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
        cls.enrollments_db[enr_id] = record
        return record

    @classmethod
    def issue_certificate(cls, employee_id: str, course_title: str) -> DigitalCertificateResponse:
        cert_id = f"CRT-{int(time.time() * 1000)}"
        raw_sig = f"{employee_id}:{course_title}:{time.time()}"
        hash_val = hashlib.sha256(raw_sig.encode()).hexdigest()[:16].upper()

        issued = time.strftime("%Y-%m-%d", time.gmtime())
        expiry = time.strftime("%Y-%m-%d", time.gmtime(time.time() + (365 * 24 * 3600)))

        return DigitalCertificateResponse(
            certificate_id=cert_id,
            employee_id=employee_id,
            employee_name="Sarah Chen",
            course_title=course_title,
            issued_date=issued,
            expiry_date=expiry,
            verification_hash=f"TOS-CERT-{hash_val}",
            skills_validated=["LangGraph Multi-Agent Architecture", "Python Async Systems"]
        )

    @classmethod
    def get_analytics_metrics(cls) -> LearningAnalyticsMetrics:
        return LearningAnalyticsMetrics(
            learning_completion_rate_pct=91.2,
            skill_growth_velocity_score=8.4,
            compliance_certification_rate_pct=98.5,
            active_learners_count=len(cls.enrollments_db) or 420,
            learning_hours_delivered_month=1240.0
        )
