from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class FinOpsCostAllocationResponse(BaseModel):
    tenant_id: str = Field(..., example="TNT-TALENTOS-01")
    monthly_compute_cost_usd: float = Field(..., example=3420.0)
    monthly_ai_token_cost_usd: float = Field(..., example=1250.0)
    monthly_storage_cost_usd: float = Field(..., example=450.0)
    waste_detected_usd: float = Field(..., example=840.0)
    projected_savings_usd: float = Field(..., example=1200.0)

class DatabaseIndexRecommendation(BaseModel):
    table_name: str = Field(..., example="fact_workforce_daily")
    suggested_index_sql: str = Field(..., example="CREATE INDEX idx_workforce_dept_date ON fact_workforce_daily(dept_id, date_key);")
    estimated_query_speedup_pct: float = 65.0
    impact_level: str = "HIGH"

class LLMRoutingOptimizationResponse(BaseModel):
    route_name: str = Field(..., example="FAQ_AND_ROUTINE_SEARCH")
    selected_model: str = "llama-3-8b-instruct"
    cost_reduction_pct: float = 88.0
    latency_reduction_pct: float = 45.0
    token_caching_enabled: bool = True

class AutoRemediationTaskRequest(BaseModel):
    target_component: str = Field(..., example="REDIS_CACHE_CLUSTER")
    remediation_action: str = Field(..., example="FLUSH_STALE_KEYS_AND_WARM_CACHE")
    triggered_by_alert: str = Field(default="HIGH_MEMORY_PRESSURE_ALERT")
    requires_human_approval: bool = False

class AutoRemediationTaskResponse(BaseModel):
    task_id: str
    target_component: str
    remediation_action: str
    status: str = "EXECUTED_SUCCESSFULLY"
    execution_duration_ms: float = 18.5
    executed_at: str

class ArchitectureHealthScorecard(BaseModel):
    overall_architecture_score: float = Field(..., example=98.4) # 0-100%
    finops_efficiency_score: float = 97.5
    database_indexing_score: float = 98.0
    ai_token_efficiency_score: float = 99.0
    sre_availability_score: float = 99.9
    security_posture_score: float = 98.0
    health_rating: str = "EXCELLENT"
