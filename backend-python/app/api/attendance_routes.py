from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.attendance_models import (
    ClockInRequest,
    ClockOutRequest,
    AttendanceRecordResponse,
    RegularizationRequest,
    AttendanceAnalyticsMetrics
)
from app.services.attendance.attendance_service import AttendanceService

router = APIRouter(prefix="/attendance", tags=["Enterprise Workforce Attendance Platform"])

@router.post("/clock-in", response_model=AttendanceRecordResponse)
def clock_in_employee(req: ClockInRequest):
    try:
        return AttendanceService.clock_in(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/clock-out", response_model=AttendanceRecordResponse)
def clock_out_employee(req: ClockOutRequest):
    try:
        return AttendanceService.clock_out(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/regularization/request")
def request_attendance_regularization(req: RegularizationRequest):
    return AttendanceService.request_regularization(req)

@router.get("/analytics/dashboard", response_model=AttendanceAnalyticsMetrics)
def get_attendance_analytics():
    return AttendanceService.get_analytics_metrics()
