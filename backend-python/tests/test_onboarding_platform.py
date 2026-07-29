import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_start_onboarding_journey_and_preboarding():
    preboard_payload = {
        "offer_id": "OFR-101",
        "candidate_name": "Sarah Chen",
        "personal_email": "sarah.chen@gmail.com",
        "phone": "+14155552671",
        "target_joining_date": "2026-08-15",
        "bank_account_number": "****5678",
        "emergency_contact": "John Chen (Spouse) - +14155559999",
        "tenant_id": "TNT-TALENTOS-01"
    }

    start_res = client.post("/api/v1/onboarding/journeys/start", json=preboard_payload)
    assert start_res.status_code == 200
    j_data = start_res.json()
    assert j_data["corporate_email"] == "sarah.chen@talentos.ai"
    assert j_data["status"] == "IT_PROVISIONING"
    assert len(j_data["tasks"]) == 5
    journey_id = j_data["journey_id"]
    task_id = j_data["tasks"][3]["task_id"]  # 4th task

    # Complete Onboarding Task
    task_res = client.post(f"/api/v1/onboarding/tasks/complete?journey_id={journey_id}&task_id={task_id}")
    assert task_res.status_code == 200
    updated_j = task_res.json()
    assert updated_j["progress_percentage"] == 80.0

def test_automated_it_provisioning_and_metrics():
    # IT Provisioning
    prov_res = client.post("/api/v1/onboarding/provisioning/execute?candidate_name=Sarah%20Chen")
    assert prov_res.status_code == 200
    prov_data = prov_res.json()
    assert prov_data["corporate_email"] == "sarah.chen@talentos.ai"
    assert prov_data["sso_account_created"] is True
    assert "TKT-HARDWARE-" in prov_data["laptop_ticket_id"]

    # Onboarding Metrics
    metrics_res = client.get("/api/v1/onboarding/analytics/metrics")
    assert metrics_res.status_code == 200
    m_data = metrics_res.json()
    assert m_data["onboarding_completion_rate_pct"] > 90.0
    assert m_data["it_provisioning_sla_met_pct"] > 95.0
