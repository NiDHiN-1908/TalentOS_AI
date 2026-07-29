import time
from typing import Dict, Any, List, Optional

class CoreMemoryService:
    # Memory stores
    working_memory_db: List[Dict[str, Any]] = []
    episodic_memory_db: List[Dict[str, Any]] = []
    semantic_memory_db: List[Dict[str, Any]] = []

    @classmethod
    def save_memory(cls, tenant_id: str, memory_type: str, entity_id: str, content: str) -> Dict[str, Any]:
        record = {
            "memory_id": f"MEM-{int(time.time() * 1000)}",
            "tenant_id": tenant_id,
            "memory_type": memory_type.upper(),
            "entity_id": entity_id,
            "content": content,
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        if memory_type.upper() == "WORKING":
            cls.working_memory_db.append(record)
        elif memory_type.upper() == "EPISODIC":
            cls.episodic_memory_db.append(record)
        else:
            cls.semantic_memory_db.append(record)

        return record

    @classmethod
    def query_memories(cls, tenant_id: str, query: str) -> List[Dict[str, Any]]:
        """Query memory stores by tenant context."""
        results = [m for m in cls.working_memory_db + cls.episodic_memory_db if m["tenant_id"] == tenant_id]
        return results if results else [{"memory_id": "MEM-INIT", "content": "Default Enterprise Context"}]
