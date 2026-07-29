from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class ReportExportFormatEnum(str, Enum):
    CSV = "CSV"
    EXCEL = "EXCEL"
    PDF = "PDF"
    JSON = "JSON"

class MetricCatalogItem(BaseModel):
    metric_id: str
    name: str = Field(..., example="Annualized Attrition Rate")
    category: str = Field(..., example="RETENTION")
    definition: str = Field(..., example="(Terminations / Avg Headcount) * 100 * (12 / Months)")
    unit: str = Field(default="PERCENTAGE")
    is_cls_protected: bool = False

class ReportQueryRequest(BaseModel):
    dimensions: List[str] = Field(default_factory=lambda: ["department_name", "location"])
    metrics: List[str] = Field(default_factory=lambda: ["headcount", "payroll_cost"])
    time_range: str = Field(default="2026-Q3")
    filter_department: Optional[str] = Field(default="Engineering")
    user_role: str = Field(default="ANALYST") # If not COMPENSATION_ANALYST, CLS masks payroll_cost
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class ReportQueryResponse(BaseModel):
    query_id: str
    dimensions: List[str]
    metrics: List[str]
    rows: List[Dict[str, Any]]
    total_records: int
    cls_masked_fields: List[str] = Field(default_factory=list)
    generated_at: str

class AIInsightNarrativeResponse(BaseModel):
    insight_title: str
    narrative_summary: str
    key_findings: List[str]
    recommended_actions: List[str]
    confidence_pct: float = 96.5

class AnalyticsDashboardSummary(BaseModel):
    active_headcount: int = 1250
    annualized_attrition_pct: float = 2.4
    hiring_velocity_days: float = 14.2
    total_payroll_cost_ytd: float = 6760000.0
    fcr_rate_pct: float = 78.5
    soc2_compliance_pct: float = 98.2
