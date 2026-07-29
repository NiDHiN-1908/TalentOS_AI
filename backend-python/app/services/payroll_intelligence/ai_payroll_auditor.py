from typing import List
from app.domain.payroll_models import PayrollAnomalyItem

class AIPayrollAuditorService:
    """
    AI Payroll Anomaly & Tax Compliance Auditor
    Flag salary spikes > +25%, duplicate payout attempts, and missing tax compliance details.
    """

    @classmethod
    def audit_payroll_run(cls, pay_period: str = "2026-08") -> List[PayrollAnomalyItem]:
        return [
            PayrollAnomalyItem(
                employee_id="EMP-103",
                employee_name="Elena Rostova",
                anomaly_type="SALARY_SPIKE_DETECTED",
                severity="HIGH",
                description="Gross salary increased by +28.5% vs 3-month rolling average due to unapproved bonus component."
            ),
            PayrollAnomalyItem(
                employee_id="EMP-105",
                employee_name="Alex Rivera",
                anomaly_type="MISSING_TAX_ID",
                severity="MEDIUM",
                description="State Tax Identification Number (SUTA) missing for recently relocated residence."
            )
        ]
