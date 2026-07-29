import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_course_creation_and_enrollment():
    # 1. Create Course
    create_payload = {
        "title": "Advanced LangGraph Multi-Agent Architecture",
        "description": "Master stateful multi-agent supervisor graphs in Python.",
        "format_type": "MICROLEARNING_VIDEO",
        "duration_minutes": 45,
        "skills_covered": ["LangGraph", "Python", "Multi-Agent Systems"],
        "target_skill_level": 4,
        "tenant_id": "TNT-TALENTOS-01"
    }

    c_res = client.post("/api/v1/learning/courses/create", json=create_payload)
    assert c_res.status_code == 200
    course_data = c_res.json()
    assert course_data["format_type"] == "MICROLEARNING_VIDEO"
    course_id = course_data["course_id"]

    # 2. Enroll Employee
    e_res = client.post(f"/api/v1/learning/enroll?employee_id=EMP-101&course_id={course_id}")
    assert e_res.status_code == 200
    assert e_res.json()["status"] == "ENROLLED"

def test_ai_learning_path_and_certificate_issuance():
    # 1. AI Adaptive Learning Path
    path_res = client.get("/api/v1/learning/paths/recommend?employee_id=EMP-101&target_role=Principal%20AI%20Architect")
    assert path_res.status_code == 200
    p_data = path_res.json()
    assert len(p_data["recommended_courses"]) >= 1
    assert p_data["estimated_weeks_to_completion"] == 6

    # 2. Digital Certificate Issuance
    cert_res = client.post("/api/v1/learning/certificates/issue?employee_id=EMP-101&course_title=Advanced%20LangGraph%20Multi-Agent%20Architecture")
    assert cert_res.status_code == 200
    cert_data = cert_res.json()
    assert cert_data["employee_name"] == "Sarah Chen"
    assert "TOS-CERT-" in cert_data["verification_hash"]

def test_learning_analytics_dashboard():
    res = client.get("/api/v1/learning/analytics/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert data["learning_completion_rate_pct"] > 90.0
    assert data["compliance_certification_rate_pct"] > 95.0
