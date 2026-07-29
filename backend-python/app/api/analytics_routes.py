from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.analytics_models import (
    MetricCatalogItem,
    ReportQueryRequest,
    ReportQueryResponse,
    ReportExportFormatEnum,
    AIInsightNarrativeResponse,
    AnalyticsDashboardSummary
)
from app.services.workforce_analytics.analytics_service import WorkforceAnalyticsService

router = APIRouter(prefix="/analytics", tags=["Enterprise Workforce Analytics Platform"])

@router.post("/reports/build", response_model=ReportQueryResponse)
def build_ad_hoc_report(req: ReportQueryRequest):
    return WorkforceAnalyticsService.build_ad_hoc_report(req)

@router.get("/metrics/catalog", response_model=List[MetricCatalogItem])
def get_metrics_catalog():
    return WorkforceAnalyticsService.get_metrics_catalog()

@router.post("/export/{format_type}")
def export_report_file(format_type: ReportExportFormatEnum = ReportExportFormatEnum.CSV):
    return WorkforceAnalyticsService.export_report_file(format_type)

@router.get("/ai/insights", response_model=AIInsightNarrativeResponse)
def get_ai_insight_narratives():
    return WorkforceAnalyticsService.generate_ai_insights()

@router.get("/dashboards/summary", response_model=AnalyticsDashboardSummary)
def get_analytics_dashboard_summary():
    return WorkforceAnalyticsService.get_dashboard_summary()
