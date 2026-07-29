import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_supervisor_sub_agent_discovery():
    agents_res = client.get("/api/v1/supervisor/agents?prompt=Audit payroll and recruitment")
    assert agents_res.status_code == 200
    agents = agents_res.json()
    assert len(agents) >= 2
    agent_ids = [a["agent_id"] for a in agents]
    assert "PAYROLL" in agent_ids
    assert "RECRUITMENT" in agent_ids

def test_supervisor_langgraph_orchestration_and_checkpointing():
    orchestrate_res = client.post(
        "/api/v1/supervisor/orchestrate",
        json={"prompt": "Check recruitment candidate score for Senior Architect", "tenant_id": "TNT-TALENTOS-01"}
    )
    assert orchestrate_res.status_code == 200
    state = orchestrate_res.json()
    assert state["status"] == "COMPLETED"
    assert len(state["executed_steps"]) >= 2
    assert state["checkpoint_id"] != ""

    # Verify Checkpoint Snapshot Retrieval
    chk_id = state["checkpoint_id"]
    chk_res = client.get(f"/api/v1/supervisor/checkpoints/{chk_id}")
    assert chk_res.status_code == 200
    chk_data = chk_res.json()
    assert chk_data["checkpoint_id"] == chk_id
    assert chk_data["tenant_id"] == "TNT-TALENTOS-01"

def test_supervisor_human_approval_intercept_gate():
    # Prompt containing "disbursal" triggers PAYROLL human approval gate
    res = client.post(
        "/api/v1/supervisor/orchestrate",
        json={"prompt": "Audit payroll anomalies and execute disbursal", "tenant_id": "TNT-TALENTOS-01"}
    )
    assert res.status_code == 200
    state = res.json()
    assert state["status"] == "WAITING_APPROVAL"
    assert len(state["pending_approvals"]) == 1
    approval_id = state["pending_approvals"][0]["approval_id"]

    # Act on approval (Approve)
    app_res = client.post(
        "/api/v1/supervisor/approvals/act",
        json={"approval_id": approval_id, "action": "APPROVE", "approver_id": "USR-101", "comments": "Payroll disbursal verified."}
    )
    assert app_res.status_code == 200
    completed_state = app_res.json()
    assert completed_state["status"] == "COMPLETED"
    assert len(completed_state["pending_approvals"]) == 0
