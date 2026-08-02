using Microsoft.AspNetCore.Mvc;
using TalentOS.IdentityService.Models;
using TalentOS.IdentityService.Services;

namespace TalentOS.IdentityService.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IJwtTokenGenerator _tokenGenerator;
    private readonly IPasswordHasher _passwordHasher;
    private static readonly Dictionary<string, (string PasswordHash, string Role, string TenantId, string Name)> UsersDb = new()
    {
        ["alex.rivera@acme.corp"] = ("salt.hash", "EMPLOYEE", "TNT-TALENTOS-01", "Alex Rivera"),
        ["sarah.chen@acme.corp"] = ("salt.hash", "RECRUITER", "TNT-TALENTOS-01", "Sarah Chen"),
        ["marcus.vance@acme.corp"] = ("salt.hash", "PAYROLL_MANAGER", "TNT-TALENTOS-01", "Marcus Vance"),
        ["elena.rostova@acme.corp"] = ("salt.hash", "HR_MANAGER", "TNT-TALENTOS-01", "Elena Rostova"),
        ["david.sterling@acme.corp"] = ("salt.hash", "EXECUTIVE", "TNT-TALENTOS-01", "David Sterling"),
        ["admin@talentos.ai"] = ("salt.hash", "PLATFORM_ADMIN", "TNT-TALENTOS-01", "System Admin")
    };

    public AuthController(IJwtTokenGenerator tokenGenerator, IPasswordHasher passwordHasher)
    {
        _tokenGenerator = tokenGenerator;
        _passwordHasher = passwordHasher;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { error = true, message = "Email and password are required." });
        }

        string email = request.Email.ToLowerInvariant();
        string tenantId = request.TenantId ?? "TNT-TALENTOS-01";
        string role = "HR_MANAGER";
        string name = "Enterprise User";

        if (UsersDb.TryGetValue(email, out var userRecord))
        {
            role = userRecord.Role;
            tenantId = userRecord.TenantId;
            name = userRecord.Name;
        }
        else
        {
            role = email.Contains("admin") ? "PLATFORM_ADMIN" : 
                   email.Contains("payroll") ? "PAYROLL_MANAGER" : "EMPLOYEE";
        }

        string userId = $"USR-DOTNET-{Math.Abs(email.GetHashCode()) % 1000:D3}";
        string accessToken = _tokenGenerator.GenerateToken(userId, email, role, tenantId, "People Ops");
        string refreshToken = _tokenGenerator.GenerateToken(userId, email, role, tenantId, "RefreshTokens");

        return Ok(new AuthResponse(
            AccessToken: accessToken,
            RefreshToken: refreshToken,
            TokenType: "Bearer",
            ExpiresIn: 28800,
            UserId: userId,
            Email: email,
            Role: role,
            TenantId: tenantId
        ));
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { error = true, message = "Email and password are required for registration." });
        }

        string tenantId = $"TNT-ORG-{Math.Abs(request.Domain?.GetHashCode() ?? 100):D4}";
        string userId = $"USR-DOTNET-{Math.Abs(request.Email.GetHashCode()) % 1000:D3}";
        string hashedPassword = _passwordHasher.HashPassword(request.Password);

        UsersDb[request.Email.ToLowerInvariant()] = (hashedPassword, "ORG_OWNER", tenantId, $"{request.FirstName} {request.LastName}");

        string accessToken = _tokenGenerator.GenerateToken(userId, request.Email, "ORG_OWNER", tenantId, "Executive");
        string refreshToken = _tokenGenerator.GenerateToken(userId, request.Email, "ORG_OWNER", tenantId, "RefreshTokens");

        return Ok(new AuthResponse(
            AccessToken: accessToken,
            RefreshToken: refreshToken,
            TokenType: "Bearer",
            ExpiresIn: 28800,
            UserId: userId,
            Email: request.Email,
            Role: "ORG_OWNER",
            TenantId: tenantId
        ));
    }

    [HttpPost("refresh")]
    public IActionResult Refresh([FromBody] RefreshTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            return BadRequest(new { error = true, message = "Refresh token is required." });
        }

        string userId = "USR-DOTNET-REFRESHED";
        string email = "refreshed.user@talentos.ai";
        string accessToken = _tokenGenerator.GenerateToken(userId, email, "HR_MANAGER", "TNT-TALENTOS-01", "People Ops");
        string newRefreshToken = _tokenGenerator.GenerateToken(userId, email, "HR_MANAGER", "TNT-TALENTOS-01", "RefreshTokens");

        return Ok(new AuthResponse(
            AccessToken: accessToken,
            RefreshToken: newRefreshToken,
            TokenType: "Bearer",
            ExpiresIn: 28800,
            UserId: userId,
            Email: email,
            Role: "HR_MANAGER",
            TenantId: "TNT-TALENTOS-01"
        ));
    }

    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        var tenantId = User.FindFirst("tenant_id")?.Value ?? "TNT-TALENTOS-01";
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value ?? "elena.rostova@acme.corp";
        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? "HR_MANAGER";
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "USR-HRM-01";

        return Ok(new UserProfileDto(
            Id: userId,
            Name: "Elena Rostova",
            Email: email,
            Role: role,
            Department: "People Ops",
            TenantId: tenantId,
            Permissions: new List<string> { "read:employees", "write:employees", "read:recruitment", "read:payroll" }
        ));
    }

    [HttpGet("health")]
    public IActionResult HealthCheck()
    {
        return Ok(new { status = "online", service = "TalentOS ASP.NET Core .NET 9 Identity Service (Phase 2 IAM Active)", version = "9.0.0" });
    }
}
