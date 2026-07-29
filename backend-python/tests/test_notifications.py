import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_notification_dispatch_and_in_app():
    dispatch_payload = {
        "recipient_user_id": "USR-101",
        "recipient_email": "sarah.chen@talentos.ai",
        "channels": ["EMAIL", "IN_APP"],
        "priority": "HIGH",
        "template_id": "offer_letter_accepted",
        "template_variables": {
            "candidate_name": "Sarah Chen",
            "role_title": "VP AI Architecture",
            "department": "Engineering",
            "company_name": "TalentOS AI",
            "start_date": "2026-08-15"
        },
        "tenant_id": "TNT-TALENTOS-01"
    }

    disp_res = client.post("/api/v1/notifications/dispatch", json=dispatch_payload)
    assert disp_res.status_code == 200
    disp_data = disp_res.json()
    assert disp_data["status"] == "SENT"
    assert "EMAIL" in disp_data["channels_dispatched"]
    assert "IN_APP" in disp_data["channels_dispatched"]
    dispatch_id = disp_data["dispatch_id"]

    # Verify Delivery Tracker Record
    deliv_res = client.get(f"/api/v1/notifications/delivery/{dispatch_id}")
    assert deliv_res.status_code == 200
    assert deliv_res.json()["status"] == "SENT"

    # Verify In-App Notification Center
    inapp_res = client.get("/api/v1/notifications/in-app?user_id=USR-101")
    assert inapp_res.status_code == 200
    inapp_items = inapp_res.json()
    assert len(inapp_items) >= 1
    target_item = inapp_items[0]
    assert "Sarah Chen" in target_item["title"]
    assert target_item["is_read"] is False
    notification_id = target_item["notification_id"]

    # Mark In-App as Read
    read_res = client.post(f"/api/v1/notifications/in-app/{notification_id}/read")
    assert read_res.status_code == 200
    assert read_res.json()["success"] is True
