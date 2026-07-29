import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_document_upload_and_chunking():
    doc_payload = {
        "title": "SOC2 Security & Compliance Policy 2026",
        "category": "Compliance",
        "content_text": "All employee laptops must enforce FileVault 256-bit encryption. Multi-factor authentication (MFA) is mandatory for all production system access.",
        "version": "v1.2",
        "file_type": "PDF"
    }

    upload_res = client.post("/api/v1/knowledge/documents/upload", json=doc_payload)
    assert upload_res.status_code == 200
    doc_data = upload_res.json()
    assert doc_data["status"] == "PUBLISHED"
    assert doc_data["chunks_count"] >= 1
    doc_id = doc_data["doc_id"]

    # Fetch Extracted Chunks
    chunks_res = client.get(f"/api/v1/knowledge/chunks/{doc_id}")
    assert chunks_res.status_code == 200
    chunks = chunks_res.json()
    assert len(chunks) == doc_data["chunks_count"]
    assert "FileVault" in chunks[0]["content"]

def test_hybrid_knowledge_search_and_citations():
    search_res = client.post(
        "/api/v1/knowledge/search",
        json={"query": "What is the laptop encryption policy?", "tenant_id": "TNT-TALENTOS-01", "top_k": 3}
    )
    assert search_res.status_code == 200
    search_data = search_res.json()
    assert search_data["retrieved_chunks_count"] >= 1
    assert len(search_data["citations"]) >= 1
    assert search_data["citations"][0]["confidence_score"] >= 0.50
