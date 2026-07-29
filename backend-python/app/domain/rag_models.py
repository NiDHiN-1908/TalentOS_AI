from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class DocumentStatusEnum(str, Enum):
    DRAFT = "DRAFT"
    PROCESSING = "PROCESSING"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"

class DocumentUploadRequest(BaseModel):
    title: str = Field(..., example="Employee Handbook 2026")
    category: str = Field(default="Policies")
    content_text: str = Field(..., example="Full text content of company policy...")
    file_type: str = Field(default="PDF")
    version: str = Field(default="v1.0")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class DocumentChunkModel(BaseModel):
    chunk_id: str
    doc_id: str
    parent_chunk_id: Optional[str] = None
    chunk_index: int
    content: str
    token_count: int
    page_number: int
    section_heading: str
    embedding: List[float] = Field(default_factory=list)

class KnowledgeCitation(BaseModel):
    document_name: str
    version: str
    page_number: int
    section_heading: str
    confidence_score: float
    chunk_id: str

class KnowledgeSearchRequest(BaseModel):
    query: str = Field(..., example="What is the remote work stipend policy?")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")
    top_k: int = Field(default=5)
    category_filter: Optional[str] = None

class KnowledgeSearchResponse(BaseModel):
    query: str
    answer: str
    citations: List[KnowledgeCitation]
    retrieved_chunks_count: int
    search_latency_ms: int

class DocumentResponse(BaseModel):
    doc_id: str
    title: str
    category: str
    version: str
    status: DocumentStatusEnum
    chunks_count: int
    created_at: str
