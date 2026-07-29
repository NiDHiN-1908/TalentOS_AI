from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.leave_models import (
    LeaveSubmitRequest,
    LeaveRequestResponse,
    LeaveBalanceSummary,
    LeaveApprovalAction,
    LeaveAnalyticsMetrics
)
from app.services.leave.leave_service import LeaveService

router = APIRouter(prefix="/leave", tags=["Enterprise Leave Management Platform"])

@router.post("/requests/submit", response_model=LeaveRequestResponse)
def submit_leave_request(req: LeaveSubmitRequest):
    try:
        return LeaveService.submit_leave_request(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/balances/{employee_id}", response_model=LeaveBalanceSummary)
def get_employee_leave_balance(employee_id: str):
    return LeaveService.get_leave_balance(employee_id)

@router.post("/requests/approve", response_model=LeaveRequestResponse)
def approve_leave_request(action: LeaveApprovalAction):
    try:
        return LeaveService.approve_leave_request(action)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/analytics/dashboard", response_model=LeaveAnalyticsMetrics)
def get_leave_analytics():
    return LeaveService.get_analytics_metrics()
