import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_leave_balance_and_request_submission():
    # 1. Get Initial Balance
    bal_res = client.get("/api/v1/leave/balances/EMP-101")
    assert bal_res.status_code == 200
    assert bal_res.json()["annual_leave_balance"] == 15.0

    # 2. Submit Valid Leave Request (5 Days)
    sub_payload = {
        "employee_id": "EMP-101",
        "leave_type": "ANNUAL",
        "start_date": "2026-08-10",
        "end_date": "2026-08-14",
        "total_days": 5.0,
        "reason": "Annual family vacation.",
        "tenant_id": "TNT-TALENTOS-01"
    }

    sub_res = client.post("/api/v1/leave/requests/submit", json=sub_payload)
    assert sub_res.status_code == 200
    req_data = sub_res.json()
    assert req_data["status"] == "PENDING_APPROVAL"
    req_id = req_data["request_id"]

    # 3. Approve Leave Request -> Balance Deducted
    app_res = client.post("/api/v1/leave/requests/approve", json={"request_id": req_id, "approver_id": "EMP-100", "action": "APPROVE"})
    assert app_res.status_code == 200
    assert app_res.json()["status"] == "APPROVED"

    # Verify Balance Updated (15 - 5 = 10 days)
    bal_res2 = client.get("/api/v1/leave/balances/EMP-101")
    assert bal_res2.json()["annual_leave_balance"] == 10.0

def test_insufficient_leave_balance_rejection():
    # Attempt requesting 30 days annual leave (Available: 10 days)
    excessive_payload = {
        "employee_id": "EMP-101",
        "leave_type": "ANNUAL",
        "start_date": "2026-09-01",
        "end_date": "2026-09-30",
        "total_days": 30.0,
        "reason": "Extended sabbatical without approval"
    }

    res = client.post("/api/v1/leave/requests/submit", json=excessive_payload)
    assert res.status_code == 400
    assert "Insufficient annual leave balance" in res.json()["detail"]

def test_leave_analytics_dashboard():
    res = client.get("/api/v1/leave/analytics/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert data["leave_utilization_rate_pct"] > 70.0
    assert data["average_approval_hours"] < 10.0
