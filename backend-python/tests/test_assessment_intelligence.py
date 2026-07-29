import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_assessment_template_creation():
    tmpl_payload = {
        "title": "Senior AI Architect Coding Assessment",
        "assessment_type": "CODING",
        "duration_minutes": 60,
        "passing_score_pct": 75.0,
        "questions_count": 3,
        "tenant_id": "TNT-TALENTOS-01"
    }

    res = client.post("/api/v1/assessment/templates/create", json=tmpl_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["assessment_type"] == "CODING"
    assert "ASM-" in data["assessment_id"]

def test_sandboxed_code_execution_and_security_blocking():
    # Valid Candidate Submission
    valid_payload = {
        "candidate_id": "CND-101",
        "assessment_id": "ASM-101",
        "language": "python",
        "code": "def solution(n): return n * 2",
        "tenant_id": "TNT-TALENTOS-01"
    }
    res1 = client.post("/api/v1/assessment/code/execute", json=valid_payload)
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["passed_tests"] == 5
    assert data1["plagiarism_detected"] is False

    # Malicious System Access Submission -> Security Blocked
    malicious_payload = {
        "candidate_id": "CND-101",
        "assessment_id": "ASM-101",
        "language": "python",
        "code": "import os; os.system('rm -rf /')",
        "tenant_id": "TNT-TALENTOS-01"
    }
    res2 = client.post("/api/v1/assessment/code/execute", json=malicious_payload)
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["runtime_complexity"] == "SECURITY_BLOCKED"
    assert data2["plagiarism_detected"] is True

def test_proctoring_and_ai_evaluation():
    # Log Proctoring Event
    proc_res = client.post("/api/v1/assessment/proctoring/log?candidate_id=CND-101&assessment_id=ASM-101&event_type=TAB_SWITCH_DETECTED")
    assert proc_res.status_code == 200
    assert proc_res.json()["event_type"] == "TAB_SWITCH_DETECTED"

    # Evaluate Submission
    eval_res = client.post("/api/v1/assessment/submissions/evaluate?assessment_id=ASM-101&candidate_id=CND-101")
    assert eval_res.status_code == 200
    eval_data = eval_res.json()
    assert eval_data["overall_score_pct"] >= 90.0
    assert eval_data["hiring_recommendation"] == "STRONG_PASS"
    assert "Algorithms & Data Structures" in eval_data["skill_competencies"]
