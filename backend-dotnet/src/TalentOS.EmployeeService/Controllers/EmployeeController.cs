using Microsoft.AspNetCore.Mvc;

namespace TalentOS.EmployeeService.Controllers;

public record EmployeeDto(
    string Id, 
    string EmployeeCode, 
    string FirstName, 
    string LastName, 
    string Email, 
    string RoleTitle, 
    string Department, 
    decimal BaseSalary, 
    string FlightRiskLevel, 
    string Status
);

public record DepartmentDto(string Id, string Name, string Code, int Headcount);

[ApiController]
[Route("api/v1/employees")]
public class EmployeeController : ControllerBase
{
    private static readonly List<EmployeeDto> Employees = new()
    {
        new("EMP-001", "EMP-1001", "Alex", "Rivera", "alex.rivera@acme.corp", "Senior Software Engineer", "Engineering", 145000.00m, "Low", "Active"),
        new("EMP-002", "EMP-1002", "Sarah", "Chen", "sarah.chen@acme.corp", "Lead Technical Recruiter", "Talent Acquisition", 125000.00m, "Low", "Active"),
        new("EMP-003", "EMP-1003", "Marcus", "Vance", "marcus.vance@acme.corp", "Global Payroll Director", "Finance", 160000.00m, "Low", "Active"),
        new("EMP-004", "EMP-1004", "Elena", "Rostova", "elena.rostova@acme.corp", "VP of People & Culture", "People Ops", 175000.00m, "Low", "Active"),
        new("EMP-005", "EMP-1005", "David", "Sterling", "david.sterling@acme.corp", "Chief Executive Officer", "Executive Office", 350000.00m, "Low", "Active")
    };

    [HttpGet]
    public IActionResult GetEmployees()
    {
        return Ok(new { status = "success", data = Employees, total = Employees.Count });
    }

    [HttpGet("{id}")]
    public IActionResult GetEmployeeById(string id)
    {
        var emp = Employees.FirstOrDefault(e => e.Id == id || e.EmployeeCode == id);
        if (emp == null) return NotFound(new { error = true, message = "Employee not found." });
        return Ok(new { status = "success", data = emp });
    }

    [HttpPost]
    public IActionResult CreateEmployee([FromBody] EmployeeDto newEmp)
    {
        Employees.Add(newEmp);
        return CreatedAtAction(nameof(GetEmployeeById), new { id = newEmp.Id }, new { status = "success", data = newEmp });
    }

    [HttpGet("departments")]
    public IActionResult GetDepartments()
    {
        var departments = new List<DepartmentDto>
        {
            new("DEP-01", "Engineering", "ENG", 42),
            new("DEP-02", "Talent Acquisition", "TA", 12),
            new("DEP-03", "Finance", "FIN", 18),
            new("DEP-04", "People Ops", "HR", 15),
            new("DEP-05", "Executive Office", "EXEC", 5)
        };
        return Ok(new { status = "success", data = departments });
    }
}
