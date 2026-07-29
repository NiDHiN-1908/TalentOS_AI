from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class PayrollCycleEnum(str, Enum):
    MONTHLY = "MONTHLY"
    WEEKLY = "WEEKLY"
    BI_WEEKLY = "BI_WEEKLY"
    OFF_CYCLE = "OFF_CYCLE"

class PayrollRunRequest(BaseModel):
    pay_period: str = Field(..., example="2026-08")
    cycle_type: PayrollCycleEnum = PayrollCycleEnum.MONTHLY
    department: Optional[str] = Field(default="ALL")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class GrossToNetCalculation(BaseModel):
    employee_id: str
    employee_name: str
    basic_salary: float
    allowances: float
    overtime_pay: float
    gross_salary: float
    income_tax_deduction: float
    social_security_deduction: float
    health_insurance_deduction: float
    total_deductions: float
    net_salary_payout: float
    currency: str = "USD"

class DigitalPayslip(BaseModel):
    payslip_id: str
    employee_id: str
    employee_name: str
    pay_period: str
    gross_salary: float
    total_deductions: float
    net_salary_payout: float
    calculation_details: GrossToNetCalculation
    generated_at: str

class BankPaymentFileResponse(BaseModel):
    file_id: str
    format_type: str = Field(..., example="NACHA_ACH") # NACHA_ACH / SWIFT_SEPA
    total_batch_amount: float
    total_records_count: int
    raw_content_preview: str

class PayrollAnomalyItem(BaseModel):
    employee_id: str
    employee_name: str
    anomaly_type: str = Field(..., example="SALARY_SPIKE_DETECTED")
    severity: str = Field(..., example="HIGH")
    description: str

class PayrollAnalyticsSummary(BaseModel):
    total_payroll_cost: float = 845000.0
    total_tax_liability: float = 169000.0
    total_overtime_cost: float = 24500.0
    accuracy_rate_pct: float = 99.8
    anomalies_flagged_count: int = 2
