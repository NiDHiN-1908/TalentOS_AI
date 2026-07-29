import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_resume_parsing_and_skill_extraction():
    resume_payload = {
        "resume_text": "Sarah Chen, Principal AI Architect with 8 years experience in PyTorch, LangGraph, Python, and FastAPI.",
        "tenant_id": "TNT-TALENTOS-01"
    }

    parse_res = client.post("/api/v1/resume/parse", json=resume_payload)
    assert parse_res.status_code == 200
    parsed = parse_res.json()
    assert parsed["candidate_name"] == "Sarah Chen"
    assert parsed["quality_score"] > 90.0
    extracted_names = [s["name"] for s in parsed["skills"]]
    assert "PyTorch" in extracted_names
    assert "LangGraph" in extracted_names

def test_xai_job_matching_and_ranking():
    match_payload = {
        "resume_text": "Sarah Chen, AI Architect experienced in PyTorch, LangGraph, Python, and FastAPI.",
        "job_description": "Looking for a Principal AI Architect with PyTorch and LangGraph experience.",
        "required_skills": ["PyTorch", "LangGraph", "Python"],
        "tenant_id": "TNT-TALENTOS-01"
    }

    match_res = client.post("/api/v1/resume/match", json=match_payload)
    assert match_res.status_code == 200
    match_data = match_res.json()
    assert match_data["match_score"] >= 90.0
    assert match_data["score_breakdown"]["skill_match_pct"] > 80.0
    assert match_data["bias_audit_status"] == "PASSED_ANONYMIZED"

    # Test Candidate Pool Ranking
    rank_res = client.post(
        "/api/v1/resume/rank?job_description=Principal%20AI%20Architect",
        json=[
            "Sarah Chen, AI Architect with PyTorch and LangGraph.",
            "Junior developer with basic HTML."
        ]
    )
    assert rank_res.status_code == 200
    rankings = rank_res.json()
    assert len(rankings) == 2
    assert rankings[0]["rank"] == 1
    assert rankings[0]["match_score"] > rankings[1]["match_score"]
