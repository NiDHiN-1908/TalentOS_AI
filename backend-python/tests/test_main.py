from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "FastAPI" in data["engine"]

def test_orchestrate_agent_prompt():
    response = client.post(
        "/api/v1/orchestrate",
        json={"prompt": "Audit July payroll and check candidates", "tenant_id": "TNT-TALENTOS-01"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
    assert len(data["steps"]) >= 2
    assert data["steps"][0]["agent_type"] == "SUPERVISOR"

def test_parse_resume():
    response = client.post(
        "/api/v1/parse-resume",
        json={"candidate_id": "CAN-801", "resume_text": "Experienced PyTorch and Go developer with 7 years building systems."}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["candidate_id"] == "CAN-801"
    assert "Pytorch" in data["skills_extracted"]
    assert data["match_score"] >= 90

def test_audit_payroll():
    response = client.post(
        "/api/v1/audit-payroll",
        json={"period": "July 2026", "variance_threshold_pct": 15.0}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["period"] == "July 2026"
    assert data["anomalies_count"] == 2
