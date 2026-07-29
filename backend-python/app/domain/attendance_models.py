from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class AttendanceStatusEnum(str, Enum):
    PRESENT = "PRESENT"
    LATE_ARRIVAL = "LATE_ARRIVAL"
    EARLY_DEPARTURE = "EARLY_DEPARTURE"
    ABSENT = "ABSENT"
    ON_LEAVE = "ON_LEAVE"
    REGULARIZATION_PENDING = "REGULARIZATION_PENDING"

class ClockInRequest(BaseModel):
    employee_id: str = Field(..., example="EMP-101")
    clock_in_time: str = Field(..., example="2026-08-05T08:10:00Z")
    latitude: float = Field(..., example=37.7749)
    longitude: float = Field(..., example=-122.4194)
    device_type: str = Field(default="MOBILE_GPS")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class ClockOutRequest(BaseModel):
    employee_id: str = Field(..., example="EMP-101")
    clock_out_time: str = Field(..., example="2026-08-05T17:30:00Z")
    latitude: float = Field(..., example=37.7749)
    longitude: float = Field(..., example=-122.4194)

class AttendanceRecordResponse(BaseModel):
    attendance_id: str
    employee_id: str
    date: str
    clock_in: str
    clock_out: Optional[str] = None
    total_hours_worked: float = 0.0
    overtime_hours_1_5x: float = 0.0
    status: AttendanceStatusEnum
    geofence_valid: bool = True
    late_minutes: int = 0

class RegularizationRequest(BaseModel):
    employee_id: str
    date: str
    reason: str = Field(..., example="Forgot to clock out due to client meeting.")
    requested_clock_out: str = Field(..., example="17:30:00")

class AttendanceAnalyticsMetrics(BaseModel):
    punctuality_rate_pct: float = 94.2
    absenteeism_rate_pct: float = 2.4
    total_overtime_hours_month: float = 142.5
    shift_coverage_pct: float = 98.8
    geofence_violations_count: int = 2
