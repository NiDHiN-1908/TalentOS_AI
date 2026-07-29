import time
from typing import List
from app.services.ai_core.models import CoreTelemetryItem, ModelProviderEnum

class AITelemetryService:
    telemetry_logs: List[CoreTelemetryItem] = []

    @classmethod
    def log_telemetry(
        cls, 
        agent_id: str, 
        provider: ModelProviderEnum, 
        prompt_tokens: int, 
        completion_tokens: int, 
        cost_usd: float, 
        latency_ms: int
    ) -> CoreTelemetryItem:
        log = CoreTelemetryItem(
            event_id=f"TEL-{int(time.time() * 1000)}",
            agent_id=agent_id,
            model_provider=provider,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=prompt_tokens + completion_tokens,
            cost_usd=cost_usd,
            latency_ms=latency_ms,
            reasoning_steps_count=3,
            tool_calls_count=1,
            timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
        cls.telemetry_logs.append(log)
        return log
