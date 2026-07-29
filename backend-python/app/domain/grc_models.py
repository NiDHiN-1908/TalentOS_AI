from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class RiskSeverityEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ComplianceFrameworkEnum(str, Enum):
    SOC2_TYPE_II = "SOC2_TYPE_II"
    ISO_27001 = "ISO_27001"
    GDPR = "GDPR"
    HIPAA = "HIPAA"
    PCI_DSS = "PCI_DSS"

class PolicyCreateRequest(BaseModel):
    title: str = Field(..., example="Enterprise Information Security & Data Protection Policy")
    framework: ComplianceFrameworkEnum = ComplianceFrameworkEnum.SOC2_TYPE_II
    version: str = Field(default="1.0.0")
    owner_id: str = Field(default="USR-GRC-101")
    content_url: str = Field(..., example="https://docs.talentos.ai/policies/sec-01.pdf")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class RiskRegisterItem(BaseModel):
    risk_id: str
    risk_title: str = Field(..., example="Unauthorized Cross-Tenant Data Access Risk")
    likelihood_score: int = Field(..., ge=1, le=5, example=2)
    impact_score: int = Field(..., ge=1, le=5, example=5)
    risk_score: int = 10
    severity: RiskSeverityEnum = RiskSeverityEnum.HIGH
    mitigation_plan: str
    owner_id: str

class ControlTestResult(BaseModel):
    control_id: str
    control_name: str = Field(..., example="Multi-Tenant Database Row-Level Security Guard")
    framework: ComplianceFrameworkEnum
    test_status: str = "PASSED" # PASSED / FAILED
    automation_type: str = "AUTOMATED_CONTINUOUS"
    tested_at: str

class AuditEvidenceLog(BaseModel):
    evidence_id: str
    framework: ComplianceFrameworkEnum
    evidence_type: str = Field(..., example="TENANT_ISOLATION_TEST_LOG")
    sha256_hash: str
    logged_at: str

class AIGRCReadinessAnalysis(BaseModel):
    compliance_readiness_score: float = Field(..., example=96.5) # 0-100%
    framework_readiness: Dict[str, float] = Field(default_factory=dict)
    open_risks_count: int = 3
    critical_gaps: List[str]
    audit_recommendations: List[str]
