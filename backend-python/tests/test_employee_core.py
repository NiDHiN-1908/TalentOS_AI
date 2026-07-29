import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_employee_profile_creation_and_ssn_masking():
    emp_payload = {
        "first_name": "Sarah",
        "last_name": "Chen",
        "email": "sarah.chen@talentos.ai",
        "phone": "+14155552671",
        "job_title": "Principal AI Architect",
        "department_name": "Engineering",
        "manager_id": "EMP-100",
        "joining_date": "2026-08-15",
        "ssn_tax_id_masked": "***-**-6789",
        "base_salary_reference": 210000.0,
        "tenant_id": "TNT-TALENTOS-01"
    }

    res = client.post("/api/v1/employee/profiles", json=emp_payload)
    assert res.status_code == 200
    emp = res.json()
    assert emp["full_name"] == "Sarah Chen"
    assert emp["status"] == "PROBATION"
    assert emp["ssn_tax_id"] == "***-**-6789"
    emp_id = emp["employee_id"]

    # Record Lifecycle Event (Promotion)
    promo_res = client.post(f"/api/v1/employee/lifecycle/event?emp_id={emp_id}&event_type=PROMOTION&new_title=VP%20AI%20Engineering&reason=Annual%20Performance%20Review")
    assert promo_res.status_code == 200
    assert promo_res.json()["event_type"] == "PROMOTION"
    assert promo_res.json()["new_title"] == "VP AI Engineering"

def test_employee_directory_and_org_chart():
    # Directory Search
    dir_res = client.get("/api/v1/employee/directory/search?query=Sarah")
    assert dir_res.status_code == 200
    dir_list = dir_res.json()
    assert len(dir_list) >= 1
    assert "Sarah" in dir_list[0]["first_name"]

    # Org Chart
    org_res = client.get("/api/v1/employee/org-chart")
    assert org_res.status_code == 200
    tree = org_res.json()
    assert tree["title"] == "Chief Technology Officer"
    assert len(tree["direct_reports"]) >= 1

def test_ai_successor_recommendations():
    succ_res = client.get("/api/v1/employee/ai/successors?position_title=Chief%20Technology%20Officer")
    assert succ_res.status_code == 200
    successors = succ_res.json()
    assert len(successors) >= 1
    assert successors[0]["readiness_score_pct"] > 85.0
