import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_job_requisition_lifecycle():
    req_payload = {
        "title": "Principal AI Engineer",
        "department": "Engineering",
        "headcount": 2,
        "min_salary": 180000,
        "max_salary": 240000,
        "hiring_manager_id": "USR-101",
        "recruiter_id": "USR-102",
        "tenant_id": "TNT-TALENTOS-01"
    }

    create_res = client.post("/api/v1/recruitment/requisitions", json=req_payload)
    assert create_res.status_code == 200
    req_data = create_res.json()
    assert req_data["status"] == "PENDING_APPROVAL"
    req_id = req_data["req_id"]

    # Approve Requisition
    app_res = client.post(f"/api/v1/recruitment/requisitions/{req_id}/approve?approver_id=USR-101")
    assert app_res.status_code == 200
    assert app_res.json()["status"] == "OPEN"

def test_candidate_pipeline_and_offer_lifecycle():
    # 1. Apply Candidate
    apply_res = client.post("/api/v1/recruitment/candidates/apply?req_id=REQ-101&name=Sarah%20Chen&email=sarah.chen@talentos.ai")
    assert apply_res.status_code == 200
    cnd_data = apply_res.json()
    assert cnd_data["stage"] == "APPLIED"
    candidate_id = cnd_data["candidate_id"]

    # 2. Advance to INTERVIEW stage
    stage_res = client.post(f"/api/v1/recruitment/candidates/{candidate_id}/stage?stage=INTERVIEW")
    assert stage_res.status_code == 200
    assert stage_res.json()["stage"] == "INTERVIEW"

    # 3. Generate Offer Letter
    offer_payload = {
        "candidate_id": candidate_id,
        "req_id": "REQ-101",
        "base_salary": 210000,
        "signing_bonus": 25000,
        "start_date": "2026-09-01",
        "approver_id": "USR-101"
    }
    offer_res = client.post("/api/v1/recruitment/offers/generate", json=offer_payload)
    assert offer_res.status_code == 200
    offer_data = offer_res.json()
    assert offer_data["status"] == "EXTENDED"
    offer_id = offer_data["offer_id"]

    # 4. Accept Offer -> Triggers Onboarding Workflow
    accept_res = client.post(f"/api/v1/recruitment/offers/{offer_id}/accept")
    assert accept_res.status_code == 200
    accepted_data = accept_res.json()
    assert accepted_data["status"] == "ACCEPTED"
    assert accepted_data["onboarding_workflow_triggered"] is True

def test_recruitment_kpi_dashboard():
    kpi_res = client.get("/api/v1/recruitment/analytics/dashboard")
    assert kpi_res.status_code == 200
    kpis = kpi_res.json()
    assert kpis["time_to_hire_days"] > 0
    assert kpis["offer_acceptance_rate_pct"] > 80.0
