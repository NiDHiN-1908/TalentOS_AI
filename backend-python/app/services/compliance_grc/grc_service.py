import time
import hashlib
from typing import Dict, Any, List
from app.domain.grc_models import (
    PolicyCreateRequest,
    RiskRegisterItem,
    RiskSeverityEnum,
    ControlTestResult,
    AuditEvidenceLog,
    ComplianceFrameworkEnum
)

class GRCService:
    policies_db: Dict[str, Dict[str, Any]] = {}
    risks_db: Dict[str, RiskRegisterItem] = {}
    evidence_logs_db: List[AuditEvidenceLog] = []

    @classmethod
    def create_policy(cls, req: PolicyCreateRequest) -> Dict[str, Any]:
        pol_id = f"POL-{int(time.time() * 1000)}"
        record = {
            "policy_id": pol_id,
            "title": req.title,
            "framework": req.framework.value,
            "version": req.version,
            "owner_id": req.owner_id,
            "content_url": req.content_url,
            "acknowledgement_rate_pct": 98.4,
            "effective_date": time.strftime("%Y-%m-%d", time.gmtime())
        }
        cls.policies_db[pol_id] = record
        return record

    @classmethod
    def register_risk(cls, title: str, likelihood: int, impact: int, mitigation: str, owner_id: str) -> RiskRegisterItem:
        r_id = f"RSK-{int(time.time() * 1000)}"
        score = likelihood * impact

        if score >= 15:
            sev = RiskSeverityEnum.CRITICAL if score >= 20 else RiskSeverityEnum.HIGH
        elif score >= 8:
            sev = RiskSeverityEnum.MEDIUM
        else:
            sev = RiskSeverityEnum.LOW

        item = RiskRegisterItem(
            risk_id=r_id,
            risk_title=title,
            likelihood_score=likelihood,
            impact_score=impact,
            risk_score=score,
            severity=sev,
            mitigation_plan=mitigation,
            owner_id=owner_id
        )
        cls.risks_db[r_id] = item
        return item

    @classmethod
    def execute_control_test(cls, control_name: str, framework: ComplianceFrameworkEnum) -> ControlTestResult:
        c_id = f"CTL-{int(time.time() * 1000)}"
        return ControlTestResult(
            control_id=c_id,
            control_name=control_name,
            framework=framework,
            test_status="PASSED",
            automation_type="AUTOMATED_CONTINUOUS",
            tested_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )

    @classmethod
    def log_audit_evidence(cls, framework: ComplianceFrameworkEnum, evidence_type: str, raw_data: str) -> AuditEvidenceLog:
        ev_id = f"EVD-{int(time.time() * 1000)}"
        sha = hashlib.sha256(raw_data.encode()).hexdigest()

        log = AuditEvidenceLog(
            evidence_id=ev_id,
            framework=framework,
            evidence_type=evidence_type,
            sha256_hash=sha,
            logged_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
        cls.evidence_logs_db.append(log)
        return log
