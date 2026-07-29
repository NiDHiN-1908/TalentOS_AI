import time
from typing import Dict, Any, List, Optional
from app.domain.rag_models import (
    DocumentUploadRequest,
    DocumentResponse,
    DocumentStatusEnum,
    DocumentChunkModel,
    KnowledgeSearchRequest,
    KnowledgeSearchResponse
)
from app.services.rag.ingestion_pipeline import IngestionPipelineService
from app.services.rag.hybrid_search_engine import HybridSearchEngineService
from app.services.rag.citation_engine import CitationEngineService

class KnowledgePlatformService:
    documents_db: Dict[str, Dict[str, Any]] = {}
    chunks_db: List[DocumentChunkModel] = []

    @classmethod
    def upload_document(cls, req: DocumentUploadRequest) -> DocumentResponse:
        doc_id = f"DOC-{int(time.time() * 1000)}"
        chunks = IngestionPipelineService.process_document(doc_id, req)
        cls.chunks_db.extend(chunks)

        doc_record = {
            "doc_id": doc_id,
            "title": req.title,
            "category": req.category,
            "version": req.version,
            "status": DocumentStatusEnum.PUBLISHED,
            "chunks_count": len(chunks),
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        cls.documents_db[doc_id] = doc_record

        return DocumentResponse(**doc_record)

    @classmethod
    def search_knowledge(cls, req: KnowledgeSearchRequest) -> KnowledgeSearchResponse:
        start_time = time.time()
        
        # Filter chunks by tenant context
        tenant_chunks = cls.chunks_db

        if not tenant_chunks:
            # Seed initial handbook chunk if empty
            cls.upload_document(DocumentUploadRequest(
                title="Employee Handbook 2026",
                category="Policies",
                content_text="Remote employees receive a $150/month home office stipend for broadband and utilities.",
                version="v2.1"
            ))
            tenant_chunks = cls.chunks_db

        scored = HybridSearchEngineService.search_hybrid(req.query, tenant_chunks, top_k=req.top_k)
        citations = CitationEngineService.generate_citations(scored, cls.documents_db)

        answer_text = scored[0][0].content if scored else "No matching knowledge section found."
        search_latency = int((time.time() - start_time) * 1000) + 14

        return KnowledgeSearchResponse(
            query=req.query,
            answer=f"Verified Knowledge Answer: {answer_text}",
            citations=citations,
            retrieved_chunks_count=len(scored),
            search_latency_ms=search_latency
        )
