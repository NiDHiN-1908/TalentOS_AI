import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_daily_executive_briefing_generation():
    res = client.get("/api/v1/executive/briefing/generate")
    assert res.status_code == 200
    brief = res.json()
    assert "95.8%" in brief["executive_summary"]
    assert len(brief["key_highlights"]) >= 1

def test_natural_language_query_and_what_if_simulation():
    # 1. Natural Language Query
    nlq_payload = {
        "query_text": "What is our projected Q3 engineering payroll vs budget?",
        "executive_id": "USR-CEO-01",
        "tenant_id": "TNT-TALENTOS-01"
    }

    nlq_res = client.post("/api/v1/executive/query/ask", json=nlq_payload)
    assert nlq_res.status_code == 200
    nlq_data = nlq_res.json()
    assert nlq_data["intent_classified"] == "PAYROLL_BUDGET_FORECAST"
    assert "SELECT" in nlq_data["sql_query_executed"]
    assert nlq_data["confidence_score"] > 95.0

    # 2. What-If Scenario Simulation
    sim_payload = {
        "scenario_type": "SALARY_INCREASE",
        "percentage_change": 10.0,
        "target_department": "Engineering"
    }

    sim_res = client.post("/api/v1/executive/simulations/run", json=sim_payload)
    assert sim_res.status_code == 200
    sim_data = sim_res.json()
    assert sim_data["predicted_attrition_rate_pct"] == 2.1
    assert "Compensation Market Percentile" in sim_data["shap_feature_importance"]

def test_org_health_scorecard_and_kpis():
    # Org Health
    health_res = client.get("/api/v1/executive/health/scorecard")
    assert health_res.status_code == 200
    h_data = health_res.json()
    assert h_data["overall_health_index"] == 95.8
    assert h_data["health_status"] == "EXCELLENT"

    # Enterprise KPIs
    kpi_res = client.get("/api/v1/executive/analytics/kpis")
    assert kpi_res.status_code == 200
    k_data = kpi_res.json()
    assert k_data["active_headcount"] == 1250
    assert k_data["soc2_compliance_readiness_pct"] > 95.0
