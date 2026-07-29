import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_okr_creation_and_progress_tracking():
    # 1. Create OKR
    create_payload = {
        "employee_id": "EMP-101",
        "title": "Architect & Scale Multi-Agent LangGraph System",
        "objective": "Deliver zero-downtime microservice orchestration.",
        "key_results": ["Achieve 99.9% uptime", "Reduce p99 latency to < 100ms"],
        "target_date": "2026-12-31",
        "tenant_id": "TNT-TALENTOS-01"
    }

    c_res = client.post("/api/v1/performance/okrs/create", json=create_payload)
    assert c_res.status_code == 200
    okr_data = c_res.json()
    assert okr_data["title"] == "Architect & Scale Multi-Agent LangGraph System"
    okr_id = okr_data["okr_id"]

    # 2. Update OKR Progress
    u_payload = {
        "okr_id": okr_id,
        "progress_percentage": 85.0,
        "status_notes": "Completed initial LangGraph supervisor graph implementation."
    }
    u_res = client.post("/api/v1/performance/okrs/update-progress", json=u_payload)
    assert u_res.status_code == 200
    assert u_res.json()["progress_percentage"] == 85.0

def test_360_feedback_and_9box_grid_classification():
    # 360 Feedback
    fb_payload = {
        "employee_id": "EMP-101",
        "reviewer_id": "EMP-102",
        "reviewer_role": "PEER",
        "technical_rating": 5,
        "leadership_rating": 5,
        "collaboration_rating": 4,
        "written_feedback": "Outstanding technical depth and team mentorship."
    }
    fb_res = client.post("/api/v1/performance/feedback/submit", json=fb_payload)
    assert fb_res.status_code == 200
    assert fb_res.json()["status"] == "FEEDBACK_RECORDED"

    # 9-Box Grid Classification
    grid_res = client.get("/api/v1/performance/grid/9box?employee_id=EMP-101")
    assert grid_res.status_code == 200
    g_data = grid_res.json()
    assert g_data["nine_box_category"] == "STAR"
    assert g_data["performance_score"] >= 4.5

def test_ai_promotion_readiness_analysis():
    ai_res = client.get("/api/v1/performance/ai/promotion-readiness?employee_id=EMP-101")
    assert ai_res.status_code == 200
    data = ai_res.json()
    assert data["promotion_readiness_score"] >= 90.0
    assert data["readiness_status"] == "READY_NOW"
    assert data["burnout_risk_level"] == "LOW"
    assert len(data["key_strengths"]) >= 1
