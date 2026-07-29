import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_list_agents_and_tools():
    agents_res = client.get("/api/v1/ai/agents")
    assert agents_res.status_code == 200
    agents = agents_res.json()
    assert len(agents) >= 3
    assert any(a["agent_id"] == "SUPERVISOR" for a in agents)

    tools_res = client.get("/api/v1/ai/tools")
    assert tools_res.status_code == 200
    tools = tools_res.json()
    assert len(tools) >= 2
    assert any(t["name"] == "policy_rag_search" for t in tools)

def test_execute_ai_chat_and_telemetry():
    chat_res = client.post(
        "/api/v1/ai/chat",
        json={"prompt": "Check remote work policy and audit payroll", "model_provider": "GEMINI"}
    )
    assert chat_res.status_code == 200
    data = chat_res.json()
    assert data["status"] == "completed"
    assert "telemetry" in data
    assert data["telemetry"]["total_tokens"] > 0
    assert data["telemetry"]["cost_usd"] > 0

    # Fetch Telemetry Logs
    telem_res = client.get("/api/v1/ai/telemetry")
    assert telem_res.status_code == 200
    telem_logs = telem_res.json()
    assert len(telem_logs) >= 1

def test_policy_rag_search():
    rag_res = client.post("/api/v1/ai/rag/search?query=remote work stipend")
    assert rag_res.status_code == 200
    rag_data = rag_res.json()
    assert rag_data["confidence_score"] >= 0.90
    assert len(rag_data["citations"]) >= 1
    assert "Handbook" in rag_data["citations"][0]["document"]
