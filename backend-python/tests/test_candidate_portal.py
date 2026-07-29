import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_job_discovery_search():
    res = client.post(
        "/api/v1/candidate/jobs/search",
        json={"query": "Principal AI Architect", "tenant_id": "TNT-TALENTOS-01"}
    )
    assert res.status_code == 200
    jobs = res.json()
    assert len(jobs) >= 1
    assert jobs[0]["title"] == "Principal AI Architect"
    assert jobs[0]["match_score"] > 90.0

def test_candidate_profile_and_ai_feedback():
    res = client.get("/api/v1/candidate/profile?email=sarah.chen@talentos.ai")
    assert res.status_code == 200
    profile = res.json()
    assert profile["full_name"] == "Sarah Chen"
    assert profile["completeness_score"] >= 90.0
    assert len(profile["ai_suggestions"]) >= 1

def test_quick_apply_and_offer_esign():
    apply_payload = {
        "job_id": "JOB-101",
        "full_name": "Sarah Chen",
        "email": "sarah.chen@talentos.ai",
        "resume_text": "Experienced AI Architect specialized in LangGraph and PyTorch.",
        "tenant_id": "TNT-TALENTOS-01"
    }

    apply_res = client.post("/api/v1/candidate/applications/apply", json=apply_payload)
    assert apply_res.status_code == 200
    app_data = apply_res.json()
    assert app_data["status"] == "SUBMITTED"

    # E-Sign Digital Offer Letter
    sign_res = client.post(
        "/api/v1/candidate/offers/sign",
        json={"offer_id": "OFR-101", "candidate_signature": "Sarah Chen", "accept_terms": True}
    )
    assert sign_res.status_code == 200
    sign_data = sign_res.json()
    assert sign_data["status"] == "OFFER_ACCEPTED"
    assert sign_data["onboarding_status"] == "TRIGGERED"
