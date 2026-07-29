import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_gross_to_net_payroll_run_execution():
    run_payload = {
        "pay_period": "2026-08",
        "cycle_type": "MONTHLY",
        "department": "ALL",
        "tenant_id": "TNT-TALENTOS-01"
    }

    res = client.post("/api/v1/payroll/runs/execute", json=run_payload)
    assert res.status_code == 200
    calc_list = res.json()
    assert len(calc_list) == 3
    
    sarah = calc_list[0]
    assert sarah["employee_name"] == "Sarah Chen"
    assert sarah["basic_salary"] == 17500.0
    assert sarah["gross_salary"] > 20000.0
    assert sarah["net_salary_payout"] < sarah["gross_salary"]

def test_payslip_and_bank_nacha_generation():
    # Payslip
    ps_res = client.get("/api/v1/payroll/payslip/EMP-101")
    assert ps_res.status_code == 200
    ps_data = ps_res.json()
    assert ps_data["employee_name"] == "Sarah Chen"
    assert ps_data["net_salary_payout"] > 10000.0

    # Bank NACHA File
    file_res = client.post("/api/v1/payroll/bank-file/generate?format_type=NACHA_ACH")
    assert file_res.status_code == 200
    f_data = file_res.json()
    assert f_data["format_type"] == "NACHA_ACH"
    assert "Direct Deposit" in f_data["raw_content_preview"]

def test_ai_payroll_anomaly_audit_and_analytics():
    # AI Auditor
    audit_res = client.get("/api/v1/payroll/audit/anomalies?pay_period=2026-08")
    assert audit_res.status_code == 200
    anomalies = audit_res.json()
    assert len(anomalies) >= 1
    assert anomalies[0]["anomaly_type"] == "SALARY_SPIKE_DETECTED"

    # Analytics Summary
    summary_res = client.get("/api/v1/payroll/analytics/summary")
    assert summary_res.status_code == 200
    s_data = summary_res.json()
    assert s_data["accuracy_rate_pct"] > 99.0
    assert s_data["total_payroll_cost"] > 500000.0
