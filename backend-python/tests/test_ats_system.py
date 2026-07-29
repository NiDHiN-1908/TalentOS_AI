import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_ats_candidate_creation_and_duplicate_detection():
    # 1. Create Initial Candidate Profile
    res1 = client.post(
        "/api/v1/ats/candidates?name=Sarah%20Chen&email=sarah.chen@talentos.ai&phone=%2B14155552671&title=Principal%20AI%20Architect&skills=Python&exp_years=8"
    )
    assert res1.status_code == 200
    cand1 = res1.json()
    assert cand1["full_name"] == "Sarah Chen"
    candidate_id = cand1["candidate_id"]

    # 2. Duplicate Candidate Email Attempt -> Triggers Duplicate Flag
    res2 = client.post(
        "/api/v1/ats/candidates?name=Sarah%20Chen%20Dup&email=sarah.chen@talentos.ai&phone=%2B14155552671&title=Principal%20AI%20Architect&skills=Python&exp_years=8"
    )
    assert res2.status_code == 200
    cand2 = res2.json()
    assert cand2["is_duplicate"] is True
    assert cand2["duplicate_of_id"] == candidate_id

def test_ats_candidate_search_and_bulk_transitions():
    # Search Candidate
    search_res = client.post(
        "/api/v1/ats/candidates/search",
        json={"query": "Python", "min_experience_years": 5, "tenant_id": "TNT-TALENTOS-01"}
    )
    assert search_res.status_code == 200
    results = search_res.json()
    assert len(results) >= 1

    # Bulk Candidate Stage Transition
    bulk_payload = {
        "candidate_ids": [results[0]["candidate_id"]],
        "req_id": "REQ-101",
        "target_stage": "TECHNICAL_INTERVIEW",
        "reason": "Sourcing screening passed"
    }
    bulk_res = client.post("/api/v1/ats/pipeline/bulk-transition", json=bulk_payload)
    assert bulk_res.status_code == 200
    assert bulk_res.json()["status"] == "SUCCESS"
    assert bulk_res.json()["transitioned_candidates_count"] == 1

def test_interview_scorecard_submission_and_recruiter_workspace():
    # Submit Scorecard
    sc_payload = {
        "candidate_id": "ATS-CND-101",
        "req_id": "REQ-101",
        "interviewer_id": "USR-105",
        "interviewer_name": "Dr. Marcus Vance",
        "technical_rating": 5,
        "architecture_rating": 5,
        "culture_fit_rating": 4,
        "overall_recommendation": "STRONG_HIRE",
        "written_feedback": "Exceptional expertise in LangGraph and distributed vector systems."
    }

    sc_res = client.post("/api/v1/ats/scorecards/submit", json=sc_payload)
    assert sc_res.status_code == 200
    sc_data = sc_res.json()
    assert sc_data["average_score"] == 4.7
    assert sc_data["overall_recommendation"] == "STRONG_HIRE"

    # Recruiter Workspace Metrics
    wrk_res = client.get("/api/v1/ats/workspaces/recruiter")
    assert wrk_res.status_code == 200
    metrics = wrk_res.json()
    assert metrics["assigned_requisitions_count"] > 0
    assert metrics["pending_scorecards_count"] >= 1
