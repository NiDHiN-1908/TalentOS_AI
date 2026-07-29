import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_model_router_generation():
    response = client.post("/api/v1/ai-core/router/generate?prompt=Audit payroll variance&task_type=general")
    assert response.status_code == 200
    data = response.json()
    assert "completion" in data
    assert "telemetry" in data
    assert data["telemetry"]["total_tokens"] > 0

def test_prompt_template_rendering():
    render_res = client.post(
        "/api/v1/ai-core/prompts/render",
        json={"template_id": "welcome_template", "variables": {"employee_name": "Sarah Chen", "company_name": "TalentOS AI"}}
    )
    assert render_res.status_code == 200
    data = render_res.json()
    assert "Sarah Chen" in data["rendered_prompt"]

def test_sandboxed_tool_execution():
    # Test Employee Search tool
    emp_res = client.post(
        "/api/v1/ai-core/tools/execute",
        json={"tool_name": "employee_search", "parameters": {"employee_id": "EMP-101"}}
    )
    assert emp_res.status_code == 200
    emp_data = emp_res.json()
    assert emp_data["success"] is True
    assert emp_data["result"]["data"]["name"] == "Sarah Chen"

    # Test Payroll Lookup tool
    pay_res = client.post(
        "/api/v1/ai-core/tools/execute",
        json={"tool_name": "payroll_lookup", "parameters": {}}
    )
    assert pay_res.status_code == 200
    pay_data = pay_res.json()
    assert pay_data["success"] is True
    assert pay_data["result"]["data"]["gross_run_rate"] == 825000

def test_rag_core_search_and_citations():
    rag_res = client.post(
        "/api/v1/ai-core/rag/search",
        json={"query": "Remote work stipend policy", "tenant_id": "TNT-TALENTOS-01"}
    )
    assert rag_res.status_code == 200
    rag_data = rag_res.json()
    assert rag_data["confidence_score"] >= 0.90
    assert len(rag_data["citations"]) >= 1
    assert "Handbook" in rag_data["citations"][0]["document_name"]
