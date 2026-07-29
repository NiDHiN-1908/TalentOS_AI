import time
from typing import Dict, Any, List
from app.domain.executive_models import (
    NLQQueryRequest,
    NLQQueryResponse,
    OrganizationHealthScorecard,
    EnterpriseKPISummary
)

class ExecutiveService:
    @classmethod
    def process_nlq_query(cls, req: NLQQueryRequest) -> NLQQueryResponse:
        q_lower = req.query_text.lower()

        if "payroll" in q_lower or "budget" in q_lower:
            intent = "PAYROLL_BUDGET_FORECAST"
            sql = "SELECT SUM(gross_salary), pay_period FROM payroll_records WHERE department = 'Engineering' GROUP BY pay_period;"
            results = {"actual_spend_ytd": 6760000.0, "budget_allocated": 7200000.0, "variance": -440000.0}
            explanation = "Engineering payroll is tracking $440,000 under budget YTD with 98.5% confidence."
        elif "attrition" in q_lower or "turnover" in q_lower:
            intent = "ATTRITION_PREDICTION"
            sql = "SELECT department, AVG(attrition_risk) FROM employee_analytics GROUP BY department;"
            results = {"engineering_attrition_risk": 2.4, "sales_attrition_risk": 4.1}
            explanation = "Engineering attrition risk remains at an all-time low (2.4%) due to high compensation alignment."
        else:
            intent = "GENERAL_ENTERPRISE_KPI"
            sql = "SELECT * FROM enterprise_kpi_summary;"
            results = {"headcount": 1250, "health_score": 95.8}
            explanation = "Enterprise operations are performing at optimal efficiency."

        return NLQQueryResponse(
            query_text=req.query_text,
            intent_classified=intent,
            sql_query_executed=sql,
            data_results=results,
            ai_explanation=explanation,
            confidence_score=98.5
        )

    @classmethod
    def get_organization_health_scorecard(cls) -> OrganizationHealthScorecard:
        # Health Index Formula: 25% Hiring + 25% Attendance + 25% Helpdesk CSAT + 25% GRC Compliance
        hiring_score = 96.0
        attendance_score = 94.2
        csat_score = 97.0
        grc_score = 96.0

        overall = round((hiring_score + attendance_score + csat_score + grc_score) / 4.0, 1)

        return OrganizationHealthScorecard(
            overall_health_index=overall,
            hiring_velocity_score=hiring_score,
            attendance_punctuality_score=attendance_score,
            service_csat_score=csat_score,
            compliance_readiness_score=grc_score,
            health_status="EXCELLENT"
        )

    @classmethod
    def get_enterprise_kpi_summary(cls) -> EnterpriseKPISummary:
        return EnterpriseKPISummary(
            active_headcount=1250,
            monthly_payroll_spend=845000.0,
            offer_acceptance_rate_pct=88.5,
            learning_completion_rate_pct=91.2,
            soc2_compliance_readiness_pct=98.2
        )
