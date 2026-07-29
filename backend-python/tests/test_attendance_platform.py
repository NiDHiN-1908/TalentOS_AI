import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_clock_in_out_and_overtime_calculation():
    # 1. Clock In
    in_payload = {
        "employee_id": "EMP-101",
        "clock_in_time": "2026-08-05T08:10:00Z",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "device_type": "MOBILE_GPS",
        "tenant_id": "TNT-TALENTOS-01"
    }

    in_res = client.post("/api/v1/attendance/clock-in", json=in_payload)
    assert in_res.status_code == 200
    in_data = in_res.json()
    assert in_data["status"] == "PRESENT"
    assert in_data["geofence_valid"] is True
    assert in_data["late_minutes"] == 10

    # 2. Clock Out with Overtime
    out_payload = {
        "employee_id": "EMP-101",
        "clock_out_time": "2026-08-05T17:30:00Z",
        "latitude": 37.7749,
        "longitude": -122.4194
    }

    out_res = client.post("/api/v1/attendance/clock-out", json=out_payload)
    assert out_res.status_code == 200
    out_data = out_res.json()
    assert out_data["total_hours_worked"] == 9.5
    assert out_data["overtime_hours_1_5x"] == 1.5

def test_regularization_request_and_analytics():
    # Regularization
    reg_payload = {
        "employee_id": "EMP-101",
        "date": "2026-08-04",
        "reason": "Forgot to clock out due to client meeting.",
        "requested_clock_out": "17:30:00"
    }
    reg_res = client.post("/api/v1/attendance/regularization/request", json=reg_payload)
    assert reg_res.status_code == 200
    assert reg_res.json()["status"] == "REGULARIZATION_PENDING"

    # Analytics Dashboard
    metrics_res = client.get("/api/v1/attendance/analytics/dashboard")
    assert metrics_res.status_code == 200
    m_data = metrics_res.json()
    assert m_data["punctuality_rate_pct"] > 90.0
    assert m_data["shift_coverage_pct"] > 95.0
