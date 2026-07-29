from typing import Dict, Any, List

class ConnectorManagerService:
    @classmethod
    def get_provider_health(cls) -> List[Dict[str, Any]]:
        return [
            {"provider": "MinIO / AWS S3", "status": "HEALTHY", "latency_ms": 12},
            {"provider": "SendGrid SMTP", "status": "HEALTHY", "latency_ms": 45},
            {"provider": "Meta WhatsApp Cloud API", "status": "HEALTHY", "latency_ms": 68},
            {"provider": "SAP SuccessFactors ERP", "status": "HEALTHY", "latency_ms": 110},
            {"provider": "Google Calendar API", "status": "HEALTHY", "latency_ms": 32}
        ]
