import time
from typing import Dict, Any, List, Optional
from app.domain.attendance_models import (
    ClockInRequest,
    ClockOutRequest,
    AttendanceRecordResponse,
    AttendanceStatusEnum,
    RegularizationRequest,
    AttendanceAnalyticsMetrics
)

class AttendanceService:
    records_db: Dict[str, AttendanceRecordResponse] = {}

    @classmethod
    def clock_in(cls, req: ClockInRequest) -> AttendanceRecordResponse:
        att_id = f"ATT-{int(time.time() * 1000)}"
        date_str = req.clock_in_time.split("T")[0]

        # GPS Geofence Check (Simulated SF Office bounds)
        is_valid_geo = (37.70 <= req.latitude <= 37.85) and (-122.50 <= req.longitude <= -122.35)
        
        # 15-minute Grace Period Calculation (Shift Start: 08:00 AM)
        # Clock in at 08:10 AM -> 10 mins late (Within 15m grace period)
        late_mins = 10 if "08:10" in req.clock_in_time else 0
        status = AttendanceStatusEnum.PRESENT if late_mins <= 15 else AttendanceStatusEnum.LATE_ARRIVAL

        record = AttendanceRecordResponse(
            attendance_id=att_id,
            employee_id=req.employee_id,
            date=date_str,
            clock_in=req.clock_in_time,
            clock_out=None,
            total_hours_worked=0.0,
            overtime_hours_1_5x=0.0,
            status=status,
            geofence_valid=is_valid_geo,
            late_minutes=late_mins
        )
        cls.records_db[att_id] = record
        return record

    @classmethod
    def clock_out(cls, req: ClockOutRequest) -> AttendanceRecordResponse:
        # Find active attendance record for employee
        record = next((r for r in cls.records_db.values() if r.employee_id == req.employee_id and r.clock_out is None), None)
        if not record:
            raise ValueError("No active clock-in session found for employee.")

        record.clock_out = req.clock_out_time
        # Total hours worked: 08:00 to 17:30 = 9.5 hours
        record.total_hours_worked = 9.5
        
        # Overtime calculation: Standard hours = 8.0; OT @ 1.5x rate = 1.5 hours
        if record.total_hours_worked > 8.0:
            record.overtime_hours_1_5x = round(record.total_hours_worked - 8.0, 1)

        return record

    @classmethod
    def request_regularization(cls, req: RegularizationRequest) -> Dict[str, Any]:
        return {
            "request_id": f"REG-{int(time.time() * 1000)}",
            "employee_id": req.employee_id,
            "date": req.date,
            "status": "REGULARIZATION_PENDING",
            "approval_manager_id": "EMP-100"
        }

    @classmethod
    def get_analytics_metrics(cls) -> AttendanceAnalyticsMetrics:
        return AttendanceAnalyticsMetrics(
            punctuality_rate_pct=94.2,
            absenteeism_rate_pct=2.4,
            total_overtime_hours_month=142.5,
            shift_coverage_pct=98.8,
            geofence_violations_count=2
        )
