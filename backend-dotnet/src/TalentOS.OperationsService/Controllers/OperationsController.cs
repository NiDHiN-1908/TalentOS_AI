using Microsoft.AspNetCore.Mvc;

namespace TalentOS.OperationsService.Controllers;

[ApiController]
[Route("api/v1/operations")]
public class OperationsController : ControllerBase
{
    [HttpGet("attendance")]
    public IActionResult GetAttendance()
    {
        return Ok(new { status = "success", present = 142, absent = 3, remote = 28 });
    }

    [HttpGet("leave-requests")]
    public IActionResult GetLeaveRequests()
    {
        var leaves = new[]
        {
            new { id = "LV-101", employee = "Alex Rivera", type = "Annual PTO", days = 3, status = "Approved" },
            new { id = "LV-102", employee = "Sarah Chen", type = "Sick Leave", days = 1, status = "Pending" }
        };
        return Ok(new { status = "success", data = leaves });
    }

    [HttpGet("performance-reviews")]
    public IActionResult GetPerformanceReviews()
    {
        var reviews = new[]
        {
            new { id = "REV-301", employee = "Alex Rivera", rating = 4.8, reviewPeriod = "Q2 2026", flightRisk = "Low" },
            new { id = "REV-302", employee = "Marcus Vance", rating = 4.9, reviewPeriod = "Q2 2026", flightRisk = "Low" }
        };
        return Ok(new { status = "success", data = reviews });
    }

    [HttpGet("assets")]
    public IActionResult GetAssets()
    {
        var assets = new[]
        {
            new { id = "AST-801", name = "MacBook Pro M3 Max 64GB", serial = "C02G1002M3", status = "Allocated", assignee = "Alex Rivera" },
            new { id = "AST-802", name = "Dell UltraSharp 32'' 4K Monitor", serial = "CN-0982-802", status = "Allocated", assignee = "Sarah Chen" }
        };
        return Ok(new { status = "success", data = assets });
    }

    [HttpGet("workflows")]
    public IActionResult GetWorkflows()
    {
        var dags = new[]
        {
            new { dagId = "DAG-9001", goal = "Pre-Payroll Anomaly Resolution & Disbursal", status = "in_progress", stepsCompleted = 4, totalSteps = 5 }
        };
        return Ok(new { status = "success", data = dags });
    }
}
