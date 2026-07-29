import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_ticket_creation_resolution_and_csat():
    # 1. Create Ticket
    create_payload = {
        "employee_id": "EMP-101",
        "category": "IT_HARDWARE",
        "subject": "MacBook Pro Keyboard Malfunction",
        "description": "Spacebar key is sticking on my laptop.",
        "priority": "P2_HIGH",
        "tenant_id": "TNT-TALENTOS-01"
    }

    c_res = client.post("/api/v1/helpdesk/tickets/create", json=create_payload)
    assert c_res.status_code == 200
    t_data = c_res.json()
    assert t_data["assigned_queue"] == "IT_TIER_2_QUEUE"
    assert t_data["status"] == "NEW"
    ticket_id = t_data["ticket_id"]

    # 2. Resolve Ticket
    r_res = client.post(f"/api/v1/helpdesk/tickets/{ticket_id}/resolve?resolution_notes=Keyboard%20replaced%20by%20IT")
    assert r_res.status_code == 200
    assert r_res.json()["status"] == "RESOLVED"

    # 3. Submit CSAT Survey
    csat_payload = {
        "ticket_id": ticket_id,
        "rating_stars": 5,
        "feedback_notes": "Fast resolution within 1 hour!"
    }
    csat_res = client.post("/api/v1/helpdesk/csat/submit", json=csat_payload)
    assert csat_res.status_code == 200
    assert csat_res.json()["status"] == "CSAT_RECORDED"

def test_virtual_ai_support_assistant_conversation():
    # AI Query: Tax W-4
    w4_res = client.post("/api/v1/helpdesk/assistant/converse", json={"employee_id": "EMP-101", "user_query": "How do I submit my annual W-4 tax document?"})
    assert w4_res.status_code == 200
    w4_data = w4_res.json()
    assert w4_data["intent_classified"] == "HR_TAX_QUERY"
    assert len(w4_data["suggested_knowledge_articles"]) >= 1

    # AI Query: Laptop Keyboard Issue
    hw_res = client.post("/api/v1/helpdesk/assistant/converse", json={"employee_id": "EMP-101", "user_query": "My laptop keyboard is broken"})
    assert hw_res.status_code == 200
    assert hw_res.json()["intent_classified"] == "IT_HARDWARE_ISSUE"

def test_helpdesk_analytics_dashboard():
    res = client.get("/api/v1/helpdesk/analytics/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert data["first_contact_resolution_rate_pct"] > 70.0
    assert data["csat_average_score"] >= 4.5
