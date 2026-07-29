import time
from typing import Dict, Any, List, Optional
from app.domain.recruitment_models import JobRequisitionRequest, JobRequisitionResponse, RequisitionStatusEnum

class JobRequisitionService:
    requisitions_db: Dict[str, JobRequisitionResponse] = {}

    @classmethod
    def create_requisition(cls, req: JobRequisitionRequest) -> JobRequisitionResponse:
        req_id = f"REQ-{int(time.time() * 1000)}"
        salary_range = f"${int(req.min_salary):,} - ${int(req.max_salary):,}"
        
        record = JobRequisitionResponse(
            req_id=req_id,
            title=req.title,
            department=req.department,
            headcount=req.headcount,
            salary_range=salary_range,
            status=RequisitionStatusEnum.PENDING_APPROVAL,
            hiring_manager_id=req.hiring_manager_id,
            created_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
        cls.requisitions_db[req_id] = record
        return record

    @classmethod
    def approve_requisition(cls, req_id: str, approver_id: str) -> JobRequisitionResponse:
        record = cls.requisitions_db.get(req_id)
        if not record:
            raise ValueError("Requisition ID not found.")

        record.status = RequisitionStatusEnum.OPEN
        return record
