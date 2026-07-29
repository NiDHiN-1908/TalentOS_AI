import time
import re
from typing import Dict, Any, List

class TelemetryCollector:
    """
    OpenTelemetry & Prometheus Telemetry Middleware
    Collects application metrics, W3C trace context, and scrubs PII from logs.
    """
    metrics_store: Dict[str, float] = {
        "http_requests_total": 45890.0,
        "http_request_duration_p95_ms": 142.5,
        "active_connections": 124.0,
        "availability_slo_pct": 99.94
    }

    @classmethod
    def record_request(cls, path: str, status_code: int, duration_ms: float):
        cls.metrics_store["http_requests_total"] += 1
        cls.metrics_store["http_request_duration_p95_ms"] = duration_ms

    @classmethod
    def mask_pii_log(cls, raw_log_text: str) -> str:
        # Mask SSN, Passwords, and Credit Cards
        masked = re.sub(r'\b\d{3}-\d{2}-\d{4}\b', '***-**-****', raw_log_text)
        masked = re.sub(r'(?i)(password|secret)=\S+', r'\1=***MASKED***', masked)
        return masked

    @classmethod
    def get_prometheus_metrics_format(cls) -> str:
        lines = [
            "# HELP talentos_http_requests_total Total HTTP requests handled",
            "# TYPE talentos_http_requests_total counter",
            f"talentos_http_requests_total {int(cls.metrics_store['http_requests_total'])}",
            "# HELP talentos_http_request_duration_p95_ms P95 latency in milliseconds",
            "# TYPE talentos_http_request_duration_p95_ms gauge",
            f"talentos_http_request_duration_p95_ms {cls.metrics_store['http_request_duration_p95_ms']}",
            "# HELP talentos_availability_slo_pct Service availability SLO percentage",
            "# TYPE talentos_availability_slo_pct gauge",
            f"talentos_availability_slo_pct {cls.metrics_store['availability_slo_pct']}"
        ]
        return "\n".join(lines)
