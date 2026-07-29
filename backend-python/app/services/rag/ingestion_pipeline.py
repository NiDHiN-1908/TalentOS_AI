import time
from typing import List, Tuple
from app.domain.rag_models import DocumentUploadRequest, DocumentChunkModel

class IngestionPipelineService:
    """
    Document Ingestion Pipeline
    Upload -> Text Cleaning -> Metadata Extraction -> Hierarchical Parent-Child Chunking -> Embedding
    """

    @classmethod
    def process_document(cls, doc_id: str, req: DocumentUploadRequest) -> List[DocumentChunkModel]:
        chunks: List[DocumentChunkModel] = []
        cleaned_text = cls._clean_text(req.content_text)
        paragraphs = cleaned_text.split("\n\n")

        # Hierarchical Parent-Child Chunking
        chunk_idx = 1
        for p_idx, paragraph in enumerate(paragraphs, start=1):
            if not paragraph.strip():
                continue

            parent_chunk_id = f"PCHK-{doc_id}-{p_idx}"
            words = paragraph.split()

            # Split paragraph into 300-token child chunks
            words_per_chunk = 60
            for c_idx in range(0, len(words), words_per_chunk):
                child_words = words[c_idx:c_idx + words_per_chunk]
                child_content = " ".join(child_words)
                
                # Mock 1536-dim Embedding Vector
                mock_embedding = [0.01 * (i % 10) for i in range(16)]

                chunks.append(DocumentChunkModel(
                    chunk_id=f"CHK-{doc_id}-{chunk_idx}",
                    doc_id=doc_id,
                    parent_chunk_id=parent_chunk_id,
                    chunk_index=chunk_idx,
                    content=child_content,
                    token_count=len(child_words),
                    page_number=(chunk_idx // 3) + 1,
                    section_heading=f"Section {p_idx}: {req.title}",
                    embedding=mock_embedding
                ))
                chunk_idx += 1

        if not chunks:
            # Fallback single chunk
            chunks.append(DocumentChunkModel(
                chunk_id=f"CHK-{doc_id}-1",
                doc_id=doc_id,
                chunk_index=1,
                content=cleaned_text[:500],
                token_count=len(cleaned_text.split()),
                page_number=1,
                section_heading=req.title,
                embedding=[0.01] * 16
            ))

        return chunks

    @classmethod
    def _clean_text(cls, raw_text: str) -> str:
        """Sanitize text by trimming whitespace and normalizing line breaks."""
        lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
        return "\n\n".join(lines)
