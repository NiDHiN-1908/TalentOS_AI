from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class AgentRequest(BaseModel):
    prompt: str = Field(..., example="Audit July payroll anomalies and screen AI candidates")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict)

class StepTrace(BaseModel):
    node_id: str
    agent_type: str
    action_name: str
    thought_trace: str
    output_summary: str
    quality_score: float
    duration_ms: int
    tokens_used: int
    cost_usd: float

class AgentResponse(BaseModel):
    dag_id: str
    tenant_id: str
    goal_prompt: str
    status: str
    total_tokens: int
    total_cost_usd: float
    steps: List[StepTrace]
    completed_at: str

class ResumeParseRequest(BaseModel):
    candidate_id: str
    resume_text: str

class ResumeParseResponse(BaseModel):
    candidate_id: str
    experience_years: int
    skills_extracted: List[str]
    match_score: int
    ai_recommendation: str

class PayrollAuditRequest(BaseModel):
    period: str = Field(default="July 2026")
    variance_threshold_pct: float = Field(default=15.0)

class AnomalyItem(BaseModel):
    employee_id: str
    employee_name: str
    anomaly_type: str
    severity: str
    description: str

class PayrollAuditResponse(BaseModel):
    period: str
    total_audited_count: int
    anomalies_count: int
    anomalies: List[AnomalyItem]
