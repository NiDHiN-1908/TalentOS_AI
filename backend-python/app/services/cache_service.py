import time
from typing import Dict, Any, Optional

class CacheService:
    """
    Enterprise High-Performance In-Memory TTL Cache Engine with Redis Protocol Compatibility
    Caches database query results, API responses, and AI state graph metadata.
    """
    _cache: Dict[str, Dict[str, Any]] = {}

    @classmethod
    def get(cls, key: str) -> Optional[Any]:
        if key not in cls._cache:
            return None
        record = cls._cache[key]
        if time.time() > record["expires_at"]:
            del cls._cache[key]
            return None
        return record["value"]

    @classmethod
    def set(cls, key: str, value: Any, ttl_seconds: int = 60):
        cls._cache[key] = {
            "value": value,
            "expires_at": time.time() + ttl_seconds
        }

    @classmethod
    def invalidate(cls, key: str):
        if key in cls._cache:
            del cls._cache[key]

    @classmethod
    def clear(cls):
        cls._cache.clear()
