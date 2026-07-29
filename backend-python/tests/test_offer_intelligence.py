import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_offer_creation_and_ai_compensation_recommendation():
    # 1. AI Compensation Recommendation
    rec_res = client.get("/api/v1/offer/recommend-compensation?job_title=Principal%20AI%20Architect&department=Engineering&exp_years=8")
    assert rec_res.status_code == 200
    rec_data = rec_res.json()
    assert rec_data["recommended_base_salary"] == 210000.0
    assert rec_data["pay_equity_status"] == "EQUITY_VERIFIED"
    assert rec_data["acceptance_probability_pct"] > 80.0

    # 2. Create Offer
    create_payload = {
        "candidate_id": "CND-101",
        "candidate_name": "Sarah Chen",
        "candidate_email": "sarah.chen@talentos.ai",
        "req_id": "REQ-101",
        "job_title": "Principal AI Architect",
        "department": "Engineering",
        "base_salary": 210000.0,
        "signing_bonus": 25000.0,
        "equity_units": 5000,
        "relocation_stipend": 10000.0,
        "tenant_id": "TNT-TALENTOS-01"
    }
    create_res = client.post("/api/v1/offer/create", json=create_payload)
    assert create_res.status_code == 200
    offer_data = create_res.json()
    assert offer_data["status"] == "PENDING_APPROVAL"
    assert offer_data["total_comp_first_year"] == 245000.0
    offer_id = offer_data["offer_id"]

    # 3. Approve Offer
    app_res = client.post(
        "/api/v1/offer/approve",
        json={"offer_id": offer_id, "approver_id": "USR-101", "approver_role": "FINANCE_APPROVER", "action": "APPROVE"}
    )
    assert app_res.status_code == 200
    assert app_res.json()["status"] == "EXTENDED"

def test_counter_offer_cap_enforcement_and_esign():
    # 1. Valid Counter-Offer (< +10%)
    counter_payload = {
        "offer_id": "OFR-101",
        "proposed_base_salary": 220000.0,  # +4.7% increase (Within 10% policy cap)
        "proposed_signing_bonus": 30000.0,
        "candidate_notes": "Requesting alignment with Bay Area market 80th percentile."
    }
    # Create offer first for test context
    create_payload = {
        "candidate_id": "CND-101",
        "candidate_name": "Sarah Chen",
        "candidate_email": "sarah.chen@talentos.ai",
        "req_id": "REQ-101",
        "job_title": "Principal AI Architect",
        "department": "Engineering",
        "base_salary": 210000.0
    }
    c_res = client.post("/api/v1/offer/create", json=create_payload)
    offer_id = c_res.json()["offer_id"]
    counter_payload["offer_id"] = offer_id

    count_res = client.post("/api/v1/offer/negotiate", json=counter_payload)
    assert count_res.status_code == 200
    assert count_res.json()["status"] == "UNDER_NEGOTIATION"

    # 2. E-Sign Offer -> Triggers Onboarding
    esign_res = client.post(f"/api/v1/offer/{offer_id}/esign?candidate_signature=Sarah%20Chen")
    assert esign_res.status_code == 200
    signed_data = esign_res.json()
    assert signed_data["status"] == "OFFER_ACCEPTED"
    assert signed_data["onboarding_workflow_triggered"] is True

def test_excessive_counter_offer_rejection():
    c_res = client.post("/api/v1/offer/create", json={
        "candidate_id": "CND-102", "candidate_name": "Alex Rivera", "candidate_email": "alex@talentos.ai",
        "req_id": "REQ-102", "job_title": "Lead Engineer", "department": "Engineering", "base_salary": 100000.0
    })
    offer_id = c_res.json()["offer_id"]

    # Attempt +30% counter offer -> Exceeds +10% policy threshold -> Rejected with HTTP 400
    excessive_res = client.post("/api/v1/offer/negotiate", json={
        "offer_id": offer_id, "proposed_base_salary": 130000.0, "candidate_notes": "Excessive counter"
    })
    assert excessive_res.status_code == 400
    assert "exceeds maximum 10% policy threshold" in excessive_res.json()["detail"]
