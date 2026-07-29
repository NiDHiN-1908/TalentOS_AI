import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_and_execute_workflow():
    # 1. Create and Publish Workflow Definition with React Flow Visual Metadata
    def_payload = {
        "name": "Employee Onboarding Workflow",
        "description": "Automated 11-step onboarding sequence",
        "trigger_event": "talentos.offer.accepted",
        "nodes": [
            {
                "node_id": "n1",
                "node_type": "START",
                "label": "Start Onboarding",
                "position": {"x": 100.0, "y": 100.0}
            },
            {
                "node_id": "n2",
                "node_type": "APPROVAL",
                "label": "Manager IT Provisioning Approval",
                "position": {"x": 300.0, "y": 100.0},
                "config": {"approver_role": "MANAGER", "sla_hours": 24}
            },
            {
                "node_id": "n3",
                "node_type": "END",
                "label": "Onboarding Complete",
                "position": {"x": 500.0, "y": 100.0}
            }
        ],
        "edges": [
            {"edge_id": "e1-2", "source_node": "n1", "target_node": "n2"},
            {"edge_id": "e2-3", "source_node": "n2", "target_node": "n3"}
        ]
    }

    create_res = client.post("/api/v1/workflows", json=def_payload, headers={"X-Tenant-ID": "TNT-TALENTOS-01"})
    assert create_res.status_code == 200
    wf_data = create_res.json()
    assert wf_data["state"] == "PUBLISHED"
    assert wf_data["nodes_count"] == 3
    workflow_id = wf_data["workflow_id"]

    # 2. Execute Workflow Instance
    exec_res = client.post(
        "/api/v1/workflows/execute",
        json={"workflow_id": workflow_id, "trigger_payload": {"candidate_name": "Sarah Chen"}},
        headers={"X-Tenant-ID": "TNT-TALENTOS-01"}
    )
    assert exec_res.status_code == 200
    inst_data = exec_res.json()
    assert inst_data["current_state"] == "WAITING"
    assert inst_data["pending_approval_id"] is not None
    approval_id = inst_data["pending_approval_id"]

    # 3. Act on Approval (Approve)
    act_res = client.post(
        "/api/v1/workflows/approvals/act",
        json={"approval_id": approval_id, "action": "APPROVE", "approver_id": "EMP-101", "comments": "Hardware approved."}
    )
    assert act_res.status_code == 200
    completed_data = act_res.json()
    assert completed_data["current_state"] == "COMPLETED"
    assert completed_data["pending_approval_id"] is None
