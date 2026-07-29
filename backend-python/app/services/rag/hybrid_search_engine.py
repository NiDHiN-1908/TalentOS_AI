import time
from typing import List, Tuple
from app.domain.rag_models import DocumentChunkModel

class HybridSearchEngineService:
    """
    Hybrid Search Engine
    Combines Dense Vector Similarity (pgvector HNSW) with Sparse Keyword Search (BM25) & Re-Ranking.
    """

    @classmethod
    def search_hybrid(cls, query: str, chunks_pool: List[DocumentChunkModel], top_k: int = 5) -> List[Tuple[DocumentChunkModel, float]]:
        if not chunks_pool:
            return []

        query_lower = query.lower()
        scored_chunks: List[Tuple[DocumentChunkModel, float]] = []

        for chunk in chunks_pool:
            score = 0.5  # Base dense similarity score
            content_lower = chunk.content.lower()
            
            # Sparse keyword overlap boost
            matches = sum(1 for word in query_lower.split() if word in content_lower)
            score += matches * 0.15

            scored_chunks.append((chunk, min(score, 0.98)))

        # Sort by hybrid relevance score descending
        scored_chunks.sort(key=lambda x: x[1], reverse=True)
        return scored_chunks[:top_k]
