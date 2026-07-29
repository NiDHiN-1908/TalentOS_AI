from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.rag_models import (
    DocumentUploadRequest,
    DocumentResponse,
    KnowledgeSearchRequest,
    KnowledgeSearchResponse,
    DocumentChunkModel
)
from app.services.rag.knowledge_service import KnowledgePlatformService

router = APIRouter(prefix="/knowledge", tags=["Enterprise Knowledge & RAG Platform"])

@router.post("/documents/upload", response_model=DocumentResponse)
def upload_knowledge_document(req: DocumentUploadRequest):
    try:
        return KnowledgePlatformService.upload_document(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/search", response_model=KnowledgeSearchResponse)
def search_knowledge_base(req: KnowledgeSearchRequest):
    return KnowledgePlatformService.search_knowledge(req)

@router.get("/documents", response_model=List[DocumentResponse])
def list_knowledge_documents():
    return [DocumentResponse(**d) for d in KnowledgePlatformService.documents_db.values()]

@router.get("/chunks/{doc_id}", response_model=List[DocumentChunkModel])
def get_document_chunks(doc_id: str):
    chunks = [c for c in KnowledgePlatformService.chunks_db if c.doc_id == doc_id]
    return chunks
