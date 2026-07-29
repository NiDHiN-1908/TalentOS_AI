import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_schedule_interview_session():
    payload = {
        "candidate_id": "CND-101",
        "req_id": "REQ-101",
        "interview_type": "TECHNICAL",
        "interviewer_ids": ["USR-101", "USR-102"],
        "scheduled_time": "2026-08-05T14:00:00Z",
        "duration_minutes": 60,
        "time_zone": "America/Los_Angeles",
        "tenant_id": "TNT-TALENTOS-01"
    }

    res = client.post("/api/v1/interview/sessions/schedule", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "SCHEDULED"
    assert "meet.google.com" in data["video_meeting_url"]

def test_question_bank_and_ai_prep_briefing():
    # Question Bank
    q_res = client.get("/api/v1/interview/questions/bank?category=TECHNICAL")
    assert q_res.status_code == 200
    questions = q_res.json()
    assert len(questions) >= 1
    assert "LangGraph" in questions[0]["question_text"]

    # AI Prep Briefing
    brief_res = client.get("/api/v1/interview/assistant/prep-brief?candidate_id=CND-101")
    assert brief_res.status_code == 200
    brief = brief_res.json()
    assert brief["candidate_name"] == "Sarah Chen"
    assert len(brief["candidate_strengths"]) >= 1

def test_scorecard_submission_and_hiring_confidence():
    sc_payload = {
        "session_id": "INT-101",
        "candidate_id": "CND-101",
        "interviewer_id": "USR-101",
        "technical_score": 5,
        "problem_solving_score": 5,
        "communication_score": 4,
        "leadership_score": 5,
        "written_notes": "Outstanding architectural depth."
    }

    sub_res = client.post("/api/v1/interview/scorecards/submit", json=sc_payload)
    assert sub_res.status_code == 200
    assert sub_res.json()["overall_rating"] == 4.8

    # Analytics Confidence Analysis
    conf_res = client.get("/api/v1/interview/analytics/confidence?candidate_id=CND-101")
    assert conf_res.status_code == 200
    conf_data = conf_res.json()
    assert conf_data["hiring_confidence_score"] >= 90.0
    assert conf_data["overall_recommendation"] == "STRONG_HIRE"
    assert conf_data["panel_bias_warning"] is False
