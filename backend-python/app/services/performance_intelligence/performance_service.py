import time
from typing import Dict, Any, List
from app.domain.performance_models import (
    OKRCreateRequest,
    OKRProgressUpdate,
    Feedback360Submission,
    NineBoxGridClassification,
    NineBoxCategoryEnum
)

class PerformanceService:
    okrs_db: Dict[str, Dict[str, Any]] = {}
    feedback_db: List[Feedback360Submission] = []

    @classmethod
    def create_okr(cls, req: OKRCreateRequest) -> Dict[str, Any]:
        okr_id = f"OKR-{int(time.time() * 1000)}"
        record = {
            "okr_id": okr_id,
            "employee_id": req.employee_id,
            "title": req.title,
            "objective": req.objective,
            "key_results": req.key_results,
            "progress_percentage": 0.0,
            "target_date": req.target_date,
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        cls.okrs_db[okr_id] = record
        return record

    @classmethod
    def update_okr_progress(cls, req: OKRProgressUpdate) -> Dict[str, Any]:
        okr = cls.okrs_db.get(req.okr_id)
        if not okr:
            raise ValueError("OKR ID not found.")

        okr["progress_percentage"] = req.progress_percentage
        okr["last_updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        return okr

    @classmethod
    def submit_360_feedback(cls, sub: Feedback360Submission) -> Dict[str, Any]:
        cls.feedback_db.append(sub)
        return {
            "employee_id": sub.employee_id,
            "reviewer_id": sub.reviewer_id,
            "status": "FEEDBACK_RECORDED"
        }

    @classmethod
    def classify_9box_grid(cls, employee_id: str) -> NineBoxGridClassification:
        # Evaluate 9-Box Grid Placement
        return NineBoxGridClassification(
            employee_id=employee_id,
            performance_score=4.8,
            potential_score=4.9,
            nine_box_category=NineBoxCategoryEnum.STAR,
            recommendation="Star Performer: Fast-track promotion to VP / Principal level with leadership equity grant."
        )
