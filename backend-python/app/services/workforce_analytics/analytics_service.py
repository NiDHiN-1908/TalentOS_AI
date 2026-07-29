import time
from typing import Dict, Any, List, Optional
from app.domain.analytics_models import (
    MetricCatalogItem,
    ReportQueryRequest,
    ReportQueryResponse,
    ReportExportFormatEnum,
    AIInsightNarrativeResponse,
    AnalyticsDashboardSummary
)

class WorkforceAnalyticsService:
    @classmethod
    def get_metrics_catalog(cls) -> List[MetricCatalogItem]:
        return [
            MetricCatalogItem(
                metric_id="MET-101",
                name="Headcount",
                category="WORKFORCE",
                definition="Distinct count of active employee records",
                unit="COUNT",
                is_cls_protected=False
            ),
            MetricCatalogItem(
                metric_id="MET-102",
                name="Annualized Attrition Rate",
                category="RETENTION",
                definition="(Terminations / Avg Headcount) * 100 * (12 / Months)",
                unit="PERCENTAGE",
                is_cls_protected=False
            ),
            MetricCatalogItem(
                metric_id="MET-103",
                name="Gross Payroll Cost",
                category="FINANCE",
                definition="Sum of gross salary payouts + benefits spend",
                unit="CURRENCY",
                is_cls_protected=True  # CLS Masked for non-compensation roles
            )
        ]

    @classmethod
    def build_ad_hoc_report(cls, req: ReportQueryRequest) -> ReportQueryResponse:
        qid = f"QRY-{int(time.time() * 1000)}"
        masked_fields = []

        # Check Column-Level Security (CLS)
        if "payroll_cost" in req.metrics and req.user_role != "COMPENSATION_ANALYST":
            masked_fields.append("payroll_cost")

        sample_data = [
            {"department_name": "Engineering", "location": "San Francisco", "headcount": 450, "payroll_cost": "***MASKED***" if "payroll_cost" in masked_fields else "$6,760,000"},
            {"department_name": "Engineering", "location": "London", "headcount": 200, "payroll_cost": "***MASKED***" if "payroll_cost" in masked_fields else "$2,800,000"},
            {"department_name": "Sales & Marketing", "location": "New York", "headcount": 300, "payroll_cost": "***MASKED***" if "payroll_cost" in masked_fields else "$3,400,000"}
        ]

        return ReportQueryResponse(
            query_id=qid,
            dimensions=req.dimensions,
            metrics=req.metrics,
            rows=sample_data,
            total_records=len(sample_data),
            cls_masked_fields=masked_fields,
            generated_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )

    @classmethod
    def export_report_file(cls, format_type: ReportExportFormatEnum) -> Dict[str, Any]:
        return {
            "export_id": f"EXP-{int(time.time() * 1000)}",
            "format": format_type.value,
            "download_url": f"https://analytics.talentos.ai/exports/report_q3_2026.{format_type.value.lower()}",
            "status": "READY"
        }

    @classmethod
    def generate_ai_insights(cls) -> AIInsightNarrativeResponse:
        return AIInsightNarrativeResponse(
            insight_title="Q3 Workforce Retention & Velocity Optimization",
            narrative_summary="Engineering headcount expanded by +12.4% while maintaining low attrition (2.4%). First Contact Resolution (FCR) on helpdesk increased to 78.5%.",
            key_findings=[
                "Engineering hiring velocity accelerated to 14.2 days.",
                "SOC 2 compliance readiness remains optimal at 98.2%."
            ],
            recommended_actions=[
                "Maintain current competitive salary bands in Bay Area.",
                "Expand internal learning paths for junior engineers."
            ],
            confidence_pct=96.5
        )

    @classmethod
    def get_dashboard_summary(cls) -> AnalyticsDashboardSummary:
        return AnalyticsDashboardSummary(
            active_headcount=1250,
            annualized_attrition_pct=2.4,
            hiring_velocity_days=14.2,
            total_payroll_cost_ytd=6760000.0,
            fcr_rate_pct=78.5,
            soc2_compliance_pct=98.2
        )
