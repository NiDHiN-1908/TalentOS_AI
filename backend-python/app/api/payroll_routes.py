from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.payroll_models import (
    PayrollRunRequest,
    GrossToNetCalculation,
    DigitalPayslip,
    BankPaymentFileResponse,
    PayrollAnomalyItem,
    PayrollAnalyticsSummary
)
from app.services.payroll_intelligence.payroll_service import PayrollService
from app.services.payroll_intelligence.ai_payroll_auditor import AIPayrollAuditorService

router = APIRouter(prefix="/payroll", tags=["Enterprise Global Payroll Intelligence Platform"])

@router.post("/runs/execute", response_model=List[GrossToNetCalculation])
def execute_payroll_run(req: PayrollRunRequest):
    try:
        return PayrollService.execute_payroll_run(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/payslip/{employee_id}", response_model=DigitalPayslip)
def get_digital_payslip(employee_id: str):
    return PayrollService.get_payslip(employee_id)

@router.post("/bank-file/generate", response_model=BankPaymentFileResponse)
def generate_bank_payment_file(format_type: str = "NACHA_ACH"):
    return PayrollService.generate_bank_nacha_file(format_type)

@router.get("/audit/anomalies", response_model=List[PayrollAnomalyItem])
def audit_payroll_anomalies(pay_period: str = "2026-08"):
    return AIPayrollAuditorService.audit_payroll_run(pay_period)

@router.get("/analytics/summary", response_model=PayrollAnalyticsSummary)
def get_payroll_analytics():
    return PayrollService.get_analytics_summary()
