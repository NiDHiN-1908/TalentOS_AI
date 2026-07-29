import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_asset_registration_and_assignment():
    # 1. Register Asset
    create_payload = {
        "asset_name": "MacBook Pro 16 M3 Max",
        "asset_type": "LAPTOP",
        "serial_number": "C02G1004MD6M",
        "purchase_cost": 3499.0,
        "purchase_date": "2026-01-15",
        "tenant_id": "TNT-TALENTOS-01"
    }

    c_res = client.post("/api/v1/assets/create", json=create_payload)
    assert c_res.status_code == 200
    asset_data = c_res.json()
    assert "TAG-LA-" in asset_data["barcode_tag"]
    asset_id = asset_data["asset_id"]

    # 2. Assign to Employee
    a_res = client.post("/api/v1/assets/assign", json={
        "asset_id": asset_id,
        "assigned_to_employee_id": "EMP-101",
        "assigned_by_user_id": "USR-101"
    })
    assert a_res.status_code == 200
    assert a_res.json()["status"] == "ASSIGNED"
    assert a_res.json()["assigned_to"] == "EMP-101"

def test_offboarding_recovery_and_software_licenses():
    # Offboarding Recovery Clearance
    offboard_payload = {
        "employee_id": "EMP-101",
        "asset_ids": ["AST-101"],
        "hardware_condition": "EXCELLENT",
        "data_wipe_executed": True
    }
    rec_res = client.post("/api/v1/assets/offboarding/recovery-clearance", json=offboard_payload)
    assert rec_res.status_code == 200
    assert rec_res.json()["clearance_status"] == "CLEARED"

    # Software License Allocation
    lic_res = client.post("/api/v1/assets/licenses/allocate?software_name=GitHub%20Enterprise")
    assert lic_res.status_code == 200
    l_data = lic_res.json()
    assert l_data["software_name"] == "GitHub Enterprise"
    assert l_data["unused_seats_revoked"] == 10
    assert l_data["cost_savings"] == 1200.0

def test_asset_analytics_dashboard():
    res = client.get("/api/v1/assets/analytics/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert data["assignment_rate_pct"] > 90.0
    assert data["offboarding_recovery_rate_pct"] > 95.0
