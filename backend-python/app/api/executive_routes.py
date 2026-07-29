from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.executive_models import (
    ExecutiveBriefingResponse,
    NLQQueryRequest,
    NLQQueryResponse,
    WhatIfSimulationRequest,
    WhatIfSimulationResponse,
    OrganizationHealthScorecard,
    EnterpriseKPISummary
)
from app.services.executive_intelligence.executive_service import ExecutiveService
from app.services.executive_intelligence.ai_executive_copilot import AIExecutiveCopilotService

router = APIRouter(prefix="/executive", tags=["Enterprise Executive AI & Decision Intelligence Platform"])

@router.get("/briefing/generate", response_model=ExecutiveBriefingResponse)
def generate_executive_briefing():
    return AIExecutiveCopilotService.generate_daily_briefing()

@router.post("/query/ask", response_model=NLQQueryResponse)
def ask_natural_language_query(req: NLQQueryRequest):
    return ExecutiveService.process_nlq_query(req)

@router.post("/simulations/run", response_model=WhatIfSimulationResponse)
def run_what_if_simulation(req: WhatIfSimulationRequest):
    return AIExecutiveCopilotService.run_what_if_simulation(req)

@router.get("/health/scorecard", response_model=OrganizationHealthScorecard)
def get_organization_health_scorecard():
    return ExecutiveService.get_organization_health_scorecard()

@router.get("/analytics/kpis", response_model=EnterpriseKPISummary)
def get_enterprise_kpis():
    return ExecutiveService.get_enterprise_kpi_summary()
