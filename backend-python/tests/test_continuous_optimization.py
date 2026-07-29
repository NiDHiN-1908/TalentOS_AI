import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_finops_costs_and_database_suggestions():
    # FinOps Costs
    fin_res = client.get("/api/v1/optimization/finops/costs?tenant_id=TNT-TALENTOS-01")
    assert fin_res.status_code == 200
    f_data = fin_res.json()
    assert f_data["waste_detected_usd"] == 840.0
    assert f_data["projected_savings_usd"] == 1200.0

    # DB Suggestions
    db_res = client.get("/api/v1/optimization/database/suggestions")
    assert db_res.status_code == 200
    db_data = db_res.json()
    assert len(db_data) >= 1
    assert "fact_workforce_daily" in db_data[0]["table_name"]

def test_autonomous_remediation_and_human_approval_gate():
    # Automated Remediation Execution
    auto_payload = {
        "target_component": "REDIS_CACHE_CLUSTER",
        "remediation_action": "FLUSH_STALE_KEYS_AND_WARM_CACHE",
        "requires_human_approval": False
    }
    a_res = client.post("/api/v1/optimization/remediation/run", json=auto_payload)
    assert a_res.status_code == 200
    assert a_res.json()["status"] == "EXECUTED_SUCCESSFULLY"

    # Human Approval Gate Execution
    gate_payload = {
        "target_component": "KUBERNETES_NODE_POOL",
        "remediation_action": "TERMINATE_AND_REPLACE_FAILING_NODE",
        "requires_human_approval": True
    }
    g_res = client.post("/api/v1/optimization/remediation/run", json=gate_payload)
    assert g_res.status_code == 200
    assert g_res.json()["status"] == "PENDING_HUMAN_APPROVAL"

def test_architecture_health_scorecard_and_llm_routing():
    # Architecture Health
    h_res = client.get("/api/v1/optimization/health/architecture")
    assert h_res.status_code == 200
    h_data = h_res.json()
    assert h_data["overall_architecture_score"] == 98.4
    assert h_data["health_rating"] == "EXCELLENT"

    # LLM Routing
    llm_res = client.get("/api/v1/optimization/llm/routing")
    assert llm_res.status_code == 200
    assert llm_res.json()["cost_reduction_pct"] == 88.0
