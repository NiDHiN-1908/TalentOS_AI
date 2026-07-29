from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class LeaveTypeEnum(str, Enum):
    ANNUAL = "ANNUAL"
    SICK = "SICK"
    CASUAL = "CASUAL"
    MATERNITY = "MATERNITY"
    PATERNITY = "PATERNITY"
    BEREAVEMENT = "BEREAVEMENT"
    SABBATICAL = "SABBATICAL"
    UNPAID = "UNPAID"

class LeaveRequestStatusEnum(str, Enum):
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"
    WITHDRAWN = "WITHDRAWN"

class LeaveSubmitRequest(BaseModel):
    employee_id: str = Field(..., example="EMP-101")
    leave_type: LeaveTypeEnum = LeaveTypeEnum.ANNUAL
    start_date: str = Field(..., example="2026-08-10")
    end_date: str = Field(..., example="2026-08-14")
    total_days: float = Field(..., example=5.0)
    reason: str = Field(..., example="Annual family vacation.")
    medical_certificate_url: Optional[str] = None
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class LeaveBalanceSummary(BaseModel):
    employee_id: str
    annual_leave_balance: float = 15.0
    sick_leave_balance: float = 12.0
    casual_leave_balance: float = 6.0
    maternity_leave_balance: float = 112.0
    carried_forward_days: float = 5.0
    total_available_days: float = 33.0

class LeaveRequestResponse(BaseModel):
    request_id: str
    employee_id: str
    leave_type: LeaveTypeEnum
    start_date: str
    end_date: str
    total_days: float
    status: LeaveRequestStatusEnum
    staffing_conflict_warning: bool = False
    conflict_details: Optional[str] = None
    applied_at: str

class LeaveApprovalAction(BaseModel):
    request_id: str
    approver_id: str = Field(..., example="EMP-100")
    action: str = Field(..., example="APPROVE")  # APPROVE / REJECT
    comments: Optional[str] = None

class LeaveAnalyticsMetrics(BaseModel):
    leave_utilization_rate_pct: float = 78.4
    average_approval_hours: float = 3.5
    absenteeism_impact_score: float = 1.8
    staffing_conflict_prevention_count: int = 14
    pending_approvals_count: int = 6
