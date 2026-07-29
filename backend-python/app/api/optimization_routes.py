from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.optimization_models import (
    FinOpsCostAllocationResponse,
    DatabaseIndexRecommendation,
    LLMRoutingOptimizationResponse,
    AutoRemediationTaskRequest,
    AutoRemediationTaskResponse,
    ArchitectureHealthScorecard
)
from app.services.continuous_optimization.optimization_service import ContinuousOptimizationService
from app.services.continuous_optimization.autonomous_remediation import AutonomousRemediationEngine

router = APIRouter(prefix="/optimization", tags=["Enterprise Continuous Optimization Platform"])

@router.get("/finops/costs", response_model=FinOpsCostAllocationResponse)
def get_finops_cost_allocation(tenant_id: str = "TNT-TALENTOS-01"):
    return ContinuousOptimizationService.get_finops_cost_allocation(tenant_id)

@router.get("/database/suggestions", response_model=List[DatabaseIndexRecommendation])
def get_database_index_suggestions():
    return ContinuousOptimizationService.get_database_index_recommendations()

@router.post("/remediation/run", response_model=AutoRemediationTaskResponse)
def run_autonomous_remediation_task(req: AutoRemediationTaskRequest):
    return AutonomousRemediationEngine.run_remediation_task(req)

@router.get("/health/architecture", response_model=ArchitectureHealthScorecard)
def get_architecture_health_scorecard():
    return ContinuousOptimizationService.get_architecture_health_scorecard()

@router.get("/llm/routing", response_model=LLMRoutingOptimizationResponse)
def get_llm_model_routing_opt():
    return ContinuousOptimizationService.get_llm_model_routing_opt()
