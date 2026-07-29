import time
from typing import Dict, Any, List, Optional
from app.domain.leave_models import (
    LeaveSubmitRequest,
    LeaveRequestResponse,
    LeaveRequestStatusEnum,
    LeaveBalanceSummary,
    LeaveApprovalAction,
    LeaveAnalyticsMetrics,
    LeaveTypeEnum
)

class LeaveService:
    requests_db: Dict[str, LeaveRequestResponse] = {}
    balances_db: Dict[str, LeaveBalanceSummary] = {}

    @classmethod
    def get_leave_balance(cls, employee_id: str) -> LeaveBalanceSummary:
        if employee_id not in cls.balances_db:
            cls.balances_db[employee_id] = LeaveBalanceSummary(employee_id=employee_id)
        return cls.balances_db[employee_id]

    @classmethod
    def submit_leave_request(cls, req: LeaveSubmitRequest) -> LeaveRequestResponse:
        balance = cls.get_leave_balance(req.employee_id)
        
        # 1. Accrual & Entitlement Check
        if req.leave_type == LeaveTypeEnum.ANNUAL and req.total_days > balance.annual_leave_balance:
            raise ValueError(f"Insufficient annual leave balance ({balance.annual_leave_balance} days available, {req.total_days} requested).")

        req_id = f"LVE-{int(time.time() * 1000)}"

        # 2. Team Minimum Staffing Conflict Check (Simulated: 70% active coverage required)
        has_conflict = False
        conflict_msg = None
        if req.total_days >= 5.0 and req.start_date.startswith("2026-12"):  # Peak holiday season
            has_conflict = True
            conflict_msg = "Notice: Request falls during December peak season. Team active staffing projected at 68% (Below 70% threshold)."

        record = LeaveRequestResponse(
            request_id=req_id,
            employee_id=req.employee_id,
            leave_type=req.leave_type,
            start_date=req.start_date,
            end_date=req.end_date,
            total_days=req.total_days,
            status=LeaveRequestStatusEnum.PENDING_APPROVAL,
            staffing_conflict_warning=has_conflict,
            conflict_details=conflict_msg,
            applied_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
        cls.requests_db[req_id] = record
        return record

    @classmethod
    def approve_leave_request(cls, action: LeaveApprovalAction) -> LeaveRequestResponse:
        record = cls.requests_db.get(action.request_id)
        if not record:
            raise ValueError("Leave request ID not found.")

        if action.action.upper() == "APPROVE":
            record.status = LeaveRequestStatusEnum.APPROVED
            # Deduct balance
            bal = cls.get_leave_balance(record.employee_id)
            if record.leave_type == LeaveTypeEnum.ANNUAL:
                bal.annual_leave_balance -= record.total_days
                bal.total_available_days -= record.total_days
        else:
            record.status = LeaveRequestStatusEnum.REJECTED

        return record

    @classmethod
    def get_analytics_metrics(cls) -> LeaveAnalyticsMetrics:
        return LeaveAnalyticsMetrics(
            leave_utilization_rate_pct=78.4,
            average_approval_hours=3.5,
            absenteeism_impact_score=1.8,
            staffing_conflict_prevention_count=14,
            pending_approvals_count=len([r for r in cls.requests_db.values() if r.status == LeaveRequestStatusEnum.PENDING_APPROVAL]) or 6
        )
