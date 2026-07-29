import time
from typing import Dict, Any, List
from app.domain.payroll_models import (
    PayrollRunRequest,
    GrossToNetCalculation,
    DigitalPayslip,
    BankPaymentFileResponse,
    PayrollAnalyticsSummary
)

class PayrollService:
    payslips_db: Dict[str, DigitalPayslip] = {}

    @classmethod
    def calculate_employee_payroll(cls, emp_id: str, name: str, base: float, ot_hours: float = 2.0) -> GrossToNetCalculation:
        allowances = round(base * 0.20, 2)
        hourly_rate = base / 160.0
        ot_pay = round(ot_hours * 1.5 * hourly_rate, 2)
        gross = base + allowances + ot_pay

        # Tax Bracket Calculation
        if gross <= 4000.0:
            tax_rate = 0.10
        elif gross <= 12000.0:
            tax_rate = 0.20
        else:
            tax_rate = 0.30

        tax_deduction = round(gross * tax_rate, 2)
        ss_deduction = round(gross * 0.062, 2)
        health_deduction = round(gross * 0.0145, 2)
        total_ded = round(tax_deduction + ss_deduction + health_deduction, 2)
        net = round(gross - total_ded, 2)

        return GrossToNetCalculation(
            employee_id=emp_id,
            employee_name=name,
            basic_salary=base,
            allowances=allowances,
            overtime_pay=ot_pay,
            gross_salary=gross,
            income_tax_deduction=tax_deduction,
            social_security_deduction=ss_deduction,
            health_insurance_deduction=health_deduction,
            total_deductions=total_ded,
            net_salary_payout=net
        )

    @classmethod
    def execute_payroll_run(cls, req: PayrollRunRequest) -> List[GrossToNetCalculation]:
        # Process sample batch
        employees = [
            ("EMP-101", "Sarah Chen", 17500.0, 5.0),
            ("EMP-102", "Elena Rostova", 15000.0, 0.0),
            ("EMP-103", "Alex Rivera", 12000.0, 2.0)
        ]

        results = []
        for emp_id, name, base, ot in employees:
            calc = cls.calculate_employee_payroll(emp_id, name, base, ot)
            results.append(calc)

            # Store Payslip
            ps_id = f"PSL-{emp_id}-{req.pay_period}"
            cls.payslips_db[emp_id] = DigitalPayslip(
                payslip_id=ps_id,
                employee_id=emp_id,
                employee_name=name,
                pay_period=req.pay_period,
                gross_salary=calc.gross_salary,
                total_deductions=calc.total_deductions,
                net_salary_payout=calc.net_salary_payout,
                calculation_details=calc,
                generated_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            )

        return results

    @classmethod
    def get_payslip(cls, emp_id: str) -> DigitalPayslip:
        ps = cls.payslips_db.get(emp_id)
        if not ps:
            calc = cls.calculate_employee_payroll(emp_id, "Sarah Chen", 17500.0)
            return DigitalPayslip(
                payslip_id=f"PSL-{emp_id}-2026-08",
                employee_id=emp_id,
                employee_name="Sarah Chen",
                pay_period="2026-08",
                gross_salary=calc.gross_salary,
                total_deductions=calc.total_deductions,
                net_salary_payout=calc.net_salary_payout,
                calculation_details=calc,
                generated_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            )
        return ps

    @classmethod
    def generate_bank_nacha_file(cls, format_type: str = "NACHA_ACH") -> BankPaymentFileResponse:
        fid = f"BANK-FILE-{int(time.time() * 1000)}"
        preview = "101 011000015 1999999999 260805 1430 A 094001 TalentOS AI       \n260 PPD Payroll Direct Deposit"
        return BankPaymentFileResponse(
            file_id=fid,
            format_type=format_type,
            total_batch_amount=44500.0,
            total_records_count=3,
            raw_content_preview=preview
        )

    @classmethod
    def get_analytics_summary(cls) -> PayrollAnalyticsSummary:
        return PayrollAnalyticsSummary(
            total_payroll_cost=845000.0,
            total_tax_liability=169000.0,
            total_overtime_cost=24500.0,
            accuracy_rate_pct=99.8,
            anomalies_flagged_count=2
        )
