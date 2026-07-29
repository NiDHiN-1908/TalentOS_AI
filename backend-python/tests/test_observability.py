import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.telemetry import TelemetryCollector

client = TestClient(app)

def test_prometheus_metrics_export():
    res = client.get("/api/v1/observability/metrics")
    assert res.status_code == 200
    content = res.text
    assert "talentos_http_requests_total" in content
    assert "talentos_availability_slo_pct 99.94" in content

def test_pii_log_scrubbing_filter():
    raw_log = "User EMP-101 SSN is 123-45-6789 and password=SuperSecretPassword123 login success."
    clean_log = TelemetryCollector.mask_pii_log(raw_log)
    assert "123-45-6789" not in clean_log
    assert "***-**-****" in clean_log
    assert "password=***MASKED***" in clean_log

def test_ai_observability_and_slo_status():
    # AI Stats
    ai_res = client.get("/api/v1/observability/ai/stats")
    assert ai_res.status_code == 200
    ai_data = ai_res.json()
    assert ai_data["llm_inference_latency_p95_ms"] < 500.0
    assert ai_data["agent_task_success_rate_pct"] > 95.0

    # SLO Status
    slo_res = client.get("/api/v1/observability/slo/status")
    assert slo_res.status_code == 200
    slo_data = slo_res.json()
    assert slo_data["current_availability_pct"] >= 99.9
    assert slo_data["slo_breached"] is False
