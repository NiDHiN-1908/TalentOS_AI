using Microsoft.AspNetCore.Mvc;
using TalentOS.IdentityService.Models;

namespace TalentOS.IdentityService.Controllers;

[ApiController]
[Route("api/v1/security")]
public class SecurityController : ControllerBase
{
    [HttpPost("abac/evaluate")]
    public IActionResult EvaluateAbacPolicy([FromBody] AbacEvalRequest request)
    {
        bool allowed = true;
        string? denialReason = null;

        // Rule 1: Platform Admins have universal bypass
        if (request.UserRole == "PLATFORM_ADMIN")
        {
            return Ok(new AbacEvalResponse(
                Allowed: true,
                UserRole: request.UserRole,
                Action: request.Action,
                Resource: request.Resource,
                TenantId: request.TenantId,
                PolicyVersion: "2.0.0-dotnet-abac-rego",
                DenialReason: null
            ));
        }

        // Rule 2: Restricted Salary Access Guard
        if ((request.Resource == "payroll_salary" || request.Resource == "payroll_audit_ledger") && 
            request.UserRole != "EXECUTIVE" && request.UserRole != "PAYROLL_MANAGER" && request.UserRole != "HR_MANAGER")
        {
            allowed = false;
            denialReason = "ABAC Denial: Insufficient role clearance for financial salary ledger.";
        }

        // Rule 3: Clearance Level Guard
        if (request.ClearanceLevel == "RESTRICTED" && request.UserRole != "EXECUTIVE" && request.UserRole != "PLATFORM_ADMIN")
        {
            allowed = false;
            denialReason = "ABAC Denial: Data clearance level 'RESTRICTED' exceeds user authorization.";
        }

        // Rule 4: Financial Approval Limit Guard
        if (request.ApprovalAmountUsd.HasValue && request.ApprovalAmountUsd.Value > 100000.0m && request.UserRole != "EXECUTIVE")
        {
            allowed = false;
            denialReason = $"ABAC Denial: Requested action (${request.ApprovalAmountUsd:N2}) exceeds role approval limit.";
        }

        return Ok(new AbacEvalResponse(
            Allowed: allowed,
            UserRole: request.UserRole,
            Action: request.Action,
            Resource: request.Resource,
            TenantId: request.TenantId,
            PolicyVersion: "2.0.0-dotnet-abac-rego",
            DenialReason: denialReason
        ));
    }

    [HttpPost("api-keys")]
    public IActionResult CreateApiKey([FromBody] ApiKeyCreateRequest request)
    {
        string keyId = $"KEY-DOTNET-{DateTime.UtcNow.Ticks % 1000000:D6}";
        string rawKey = $"tos_live_{Guid.NewGuid():N}";

        return Ok(new ApiKeyResponse(
            KeyId: keyId,
            Name: request.Name,
            RawApiKey: rawKey,
            CreatedAt: DateTime.UtcNow.ToString("o")
        ));
    }
}
