import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_generate_presigned_url():
    res = client.post(
        "/api/v1/integrations/storage/presigned-url",
        json={"file_name": "resume_sarah_chen.pdf", "action": "WRITE", "tenant_id": "TNT-TALENTOS-01"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "presigned_url" in data
    assert "s3.us-east-1.amazonaws.com" in data["presigned_url"]
    assert data["encryption"] == "AES256"

def test_send_email_dispatch():
    res = client.post(
        "/api/v1/integrations/email/send",
        json={"to_email": "sarah.chen@talentos.ai", "subject": "Welcome to TalentOS AI", "template_name": "welcome_offer"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "DISPATCHED"
    assert data["recipient"] == "sarah.chen@talentos.ai"

def test_send_whatsapp_message():
    res = client.post(
        "/api/v1/integrations/whatsapp/send",
        json={"to_phone": "+14155552671", "template_name": "interview_reminder"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "SENT"
    assert data["recipient"] == "+14155552671"

def test_webhook_dispatch_and_hmac_signature():
    res = client.post(
        "/api/v1/integrations/webhooks/dispatch",
        json={"event_type": "talentos.employee.created", "tenant_id": "TNT-TALENTOS-01", "payload": {"employee_id": "EMP-101"}}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "DELIVERED"
    assert data["signature"].startswith("sha256=")

def test_provider_health_checker():
    res = client.get("/api/v1/integrations/health")
    assert res.status_code == 200
    providers = res.json()
    assert len(providers) >= 4
    assert any(p["provider"] == "MinIO / AWS S3" for p in providers)
