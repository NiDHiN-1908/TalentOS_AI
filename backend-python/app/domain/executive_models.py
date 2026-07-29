from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class ExecutiveBriefingResponse(BaseModel):
    briefing_id: str
    generated_at: str
    executive_summary: str
    key_highlights: List[str]
    critical_risk_alerts: List[str]
    opportunity_recommendations: List[str]

class NLQQueryRequest(BaseModel):
    query_text: str = Field(..., example="What is our projected Q3 engineering payroll vs budget?")
    executive_id: str = Field(default="USR-CEO-01")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class NLQQueryResponse(BaseModel):
    query_text: str
    intent_classified: str = "PAYROLL_BUDGET_FORECAST"
    sql_query_executed: str
    data_results: Dict[str, Any]
    ai_explanation: str
    confidence_score: float = 98.5

class WhatIfSimulationRequest(BaseModel):
    scenario_type: str = Field(..., example="SALARY_INCREASE") # SALARY_INCREASE / HIRING_FREEZE / DEPT_EXPANSION
    percentage_change: float = Field(default=10.0)
    target_department: str = Field(default="Engineering")

class WhatIfSimulationResponse(BaseModel):
    scenario_type: str
    predicted_attrition_rate_pct: float = 2.1  # Dropped from 6.2%
    monthly_payroll_impact: float = 84500.0   # +$84,500/mo
    net_roi_recommendation: str = "RECOMMENDED: Reduces annual turnover replacement cost by $340,000."
    shap_feature_importance: Dict[str, float] = Field(default_factory=dict)

class OrganizationHealthScorecard(BaseModel):
    overall_health_index: float = Field(..., example=95.8) # 0-100%
    hiring_velocity_score: float = 96.0
    attendance_punctuality_score: float = 94.2
    service_csat_score: float = 97.0
    compliance_readiness_score: float = 96.0
    health_status: str = "EXCELLENT"

class EnterpriseKPISummary(BaseModel):
    active_headcount: int = 1250
    monthly_payroll_spend: float = 845000.0
    offer_acceptance_rate_pct: float = 88.5
    learning_completion_rate_pct: float = 91.2
    soc2_compliance_readiness_pct: float = 98.2
