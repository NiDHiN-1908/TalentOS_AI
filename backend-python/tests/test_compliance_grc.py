import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_policy_creation_and_risk_register():
    # 1. Policy Creation
    pol_payload = {
        "title": "Enterprise Information Security & Data Protection Policy",
        "framework": "SOC2_TYPE_II",
        "version": "1.0.0",
        "owner_id": "USR-GRC-101",
        "content_url": "https://docs.talentos.ai/policies/sec-01.pdf",
        "tenant_id": "TNT-TALENTOS-01"
    }

    p_res = client.post("/api/v1/grc/policies/create", json=pol_payload)
    assert p_res.status_code == 200
    p_data = p_res.json()
    assert p_data["framework"] == "SOC2_TYPE_II"
    assert p_data["acknowledgement_rate_pct"] > 90.0

    # 2. Risk Registration (5x5 Matrix)
    r_res = client.post("/api/v1/grc/risks/register?title=Unauthorized%20Cross-Tenant%20Data%20Access%20Risk&likelihood=2&impact=5&mitigation=Enforce%20RLS&owner_id=USR-GRC-101")
    assert r_res.status_code == 200
    r_data = r_res.json()
    assert r_data["risk_score"] == 10
    assert r_data["severity"] == "HIGH"

def test_control_testing_and_evidence_logging():
    # 1. Automated Control Test
    ctl_res = client.post("/api/v1/grc/controls/test?control_name=Multi-Tenant%20Row-Level%20Security%20Guard&framework=SOC2_TYPE_II")
    assert ctl_res.status_code == 200
    assert ctl_res.json()["test_status"] == "PASSED"
    assert ctl_res.json()["automation_type"] == "AUTOMATED_CONTINUOUS"

    # 2. SHA-256 Evidence Logging
    ev_res = client.post("/api/v1/grc/evidence/log?framework=SOC2_TYPE_II&evidence_type=TENANT_ISOLATION_TEST_LOG&raw_data=RLS%20Test%20Passed")
    assert ev_res.status_code == 200
    ev_data = ev_res.json()
    assert len(ev_data["sha256_hash"]) == 64

def test_ai_compliance_readiness_analytics():
    res = client.get("/api/v1/grc/analytics/readiness")
    assert res.status_code == 200
    data = res.json()
    assert data["compliance_readiness_score"] > 90.0
    assert "SOC 2 Type II" in data["framework_readiness"]
