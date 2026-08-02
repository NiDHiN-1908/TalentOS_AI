using Microsoft.AspNetCore.Mvc;

namespace TalentOS.RecruitmentService.Controllers;

public record JobRequisitionDto(string Id, string Title, string Department, int Headcount, string Status);
public record CandidateDto(string Id, string Name, string Email, int AiMatchScore, string Stage);

[ApiController]
[Route("api/v1/recruitment")]
public class RecruitmentController : ControllerBase
{
    [HttpGet("jobs")]
    public IActionResult GetJobs()
    {
        var jobs = new List<JobRequisitionDto>
        {
            new("JOB-101", "Principal AI Research Scientist", "Engineering", 2, "Open"),
            new("JOB-102", "Senior ASP.NET Core Architect", "Platform Engineering", 1, "Open"),
            new("JOB-103", "Global Compensation Specialist", "Finance", 1, "Interviewing")
        };
        return Ok(new { status = "success", data = jobs });
    }

    [HttpGet("candidates")]
    public IActionResult GetCandidates()
    {
        var candidates = new List<CandidateDto>
        {
            new("CND-901", "Dr. Aris Thorne", "aris.thorne@example.com", 96, "Interviewing"),
            new("CND-902", "Maya Lin", "maya.lin@example.com", 91, "Screening"),
            new("CND-903", "Jordan Belfort", "jordan.belfort@example.com", 85, "Applied")
        };
        return Ok(new { status = "success", data = candidates });
    }
}
