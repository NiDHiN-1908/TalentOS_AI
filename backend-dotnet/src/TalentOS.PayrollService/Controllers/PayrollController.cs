using Microsoft.AspNetCore.Mvc;

namespace TalentOS.PayrollService.Controllers;

public record PayrollRunDto(string Id, string PeriodName, decimal TotalGross, int EmployeeCount, string Status);
public record PayrollAnomalyDto(string Id, string EmployeeName, string AnomalyType, string Severity, string Description);

[ApiController]
[Route("api/v1/payroll")]
public class PayrollController : ControllerBase
{
    [HttpGet("runs")]
    public IActionResult GetPayrollRuns()
    {
        var runs = new List<PayrollRunDto>
        {
            new("PAY-2026-07", "July 2026 Monthly Payroll", 1250450.00m, 142, "Approved"),
            new("PAY-2026-08", "August 2026 Monthly Payroll", 1285000.00m, 145, "Processing")
        };
        return Ok(new { status = "success", data = runs });
    }

    [HttpGet("anomalies")]
    public IActionResult GetAnomalies()
    {
        var anomalies = new List<PayrollAnomalyDto>
        {
            new("ANM-01", "Jordan Vance", "Base Salary Variance (+25%)", "High", "Salary changed outside standard compensation band"),
            new("ANM-02", "Sarah Chen", "Duplicate Tax Identifier", "Critical", "Tax ID matches existing employee entry")
        };
        return Ok(new { status = "success", data = anomalies });
    }
}
