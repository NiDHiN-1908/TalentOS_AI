from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.grc_models import (
    PolicyCreateRequest,
    RiskRegisterItem,
    ControlTestResult,
    AuditEvidenceLog,
    AIGRCReadinessAnalysis,
    ComplianceFrameworkEnum
)
from app.services.compliance_grc.grc_service import GRCService
from app.services.compliance_grc.ai_grc_advisor import AIGRCAdvisorService

router = APIRouter(prefix="/grc", tags=["Enterprise Governance, Risk & Compliance Platform"])

@router.post("/policies/create")
def create_policy(req: PolicyCreateRequest):
    return GRCService.create_policy(req)

@router.post("/risks/register", response_model=RiskRegisterItem)
def register_risk(title: str, likelihood: int = 2, impact: int = 5, mitigation: str = "Enforce RLS", owner_id: str = "USR-GRC-101"):
    return GRCService.register_risk(title, likelihood, impact, mitigation, owner_id)

@router.post("/controls/test", response_model=ControlTestResult)
def execute_control_test(control_name: str = "Multi-Tenant Row-Level Security Guard", framework: ComplianceFrameworkEnum = ComplianceFrameworkEnum.SOC2_TYPE_II):
    return GRCService.execute_control_test(control_name, framework)

@router.post("/evidence/log", response_model=AuditEvidenceLog)
def log_audit_evidence(framework: ComplianceFrameworkEnum = ComplianceFrameworkEnum.SOC2_TYPE_II, evidence_type: str = "TENANT_ISOLATION_TEST_LOG", raw_data: str = "RLS Test Passed"):
    return GRCService.log_audit_evidence(framework, evidence_type, raw_data)

@router.get("/analytics/readiness", response_model=AIGRCReadinessAnalysis)
def get_compliance_readiness_analysis():
    return AIGRCAdvisorService.analyze_compliance_readiness()
