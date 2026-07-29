import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_metrics_catalog_and_ad_hoc_report_cls_masking():
    # 1. Metrics Catalog
    cat_res = client.get("/api/v1/analytics/metrics/catalog")
    assert cat_res.status_code == 200
    metrics = cat_res.json()
    assert len(metrics) >= 3
    assert metrics[2]["name"] == "Gross Payroll Cost"
    assert metrics[2]["is_cls_protected"] is True

    # 2. Ad-Hoc Report with CLS Masking (Role: ANALYST -> Payroll Masked)
    report_payload = {
        "dimensions": ["department_name", "location"],
        "metrics": ["headcount", "payroll_cost"],
        "time_range": "2026-Q3",
        "user_role": "ANALYST",
        "tenant_id": "TNT-TALENTOS-01"
    }

    r_res = client.post("/api/v1/analytics/reports/build", json=report_payload)
    assert r_res.status_code == 200
    r_data = r_res.json()
    assert "payroll_cost" in r_data["cls_masked_fields"]
    assert r_data["rows"][0]["payroll_cost"] == "***MASKED***"

def test_file_exports_and_ai_insights():
    # File Export
    exp_res = client.post("/api/v1/analytics/export/CSV")
    assert exp_res.status_code == 200
    assert exp_res.json()["format"] == "CSV"
    assert "report_q3_2026.csv" in exp_res.json()["download_url"]

    # AI Insight Narratives
    ai_res = client.get("/api/v1/analytics/ai/insights")
    assert ai_res.status_code == 200
    ai_data = ai_res.json()
    assert ai_data["confidence_pct"] > 95.0
    assert len(ai_data["key_findings"]) >= 1

def test_analytics_dashboard_summary():
    dash_res = client.get("/api/v1/analytics/dashboards/summary")
    assert dash_res.status_code == 200
    d_data = dash_res.json()
    assert d_data["active_headcount"] == 1250
    assert d_data["annualized_attrition_pct"] == 2.4
