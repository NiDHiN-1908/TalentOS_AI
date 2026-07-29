from typing import List, Tuple
from app.domain.rag_models import DocumentChunkModel, KnowledgeCitation

class CitationEngineService:
    @classmethod
    def generate_citations(cls, scored_chunks: List[Tuple[DocumentChunkModel, float]], doc_metadata: dict) -> List[KnowledgeCitation]:
        citations: List[KnowledgeCitation] = []
        for chunk, score in scored_chunks:
            doc_info = doc_metadata.get(chunk.doc_id, {"title": "Employee Handbook", "version": "v1.0"})
            citations.append(KnowledgeCitation(
                document_name=doc_info["title"],
                version=doc_info["version"],
                page_number=chunk.page_number,
                section_heading=chunk.section_heading,
                confidence_score=round(score, 2),
                chunk_id=chunk.chunk_id
            ))
        return citations
