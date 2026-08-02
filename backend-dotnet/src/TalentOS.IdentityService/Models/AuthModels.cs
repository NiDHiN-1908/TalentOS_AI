namespace TalentOS.IdentityService.Models;

public record LoginRequest(string Email, string Password, string? TenantId, string? DeviceInfo);

public record RegisterRequest(
    string Email, 
    string Password, 
    string FirstName, 
    string LastName, 
    string? OrganizationName, 
    string? Domain
);

public record RefreshTokenRequest(string RefreshToken);

public record AuthResponse(
    string AccessToken, 
    string RefreshToken,
    string TokenType, 
    int ExpiresIn, 
    string UserId, 
    string Email, 
    string Role, 
    string TenantId
);

public record UserProfileDto(
    string Id,
    string Name,
    string Email,
    string Role,
    string Department,
    string TenantId,
    List<string> Permissions
);

public record AbacEvalRequest(
    string UserRole,
    string Action,
    string Resource,
    string TenantId,
    string? UserDepartment,
    string? ClearanceLevel,
    decimal? ApprovalAmountUsd
);

public record AbacEvalResponse(
    bool Allowed,
    string UserRole,
    string Action,
    string Resource,
    string TenantId,
    string PolicyVersion,
    string? DenialReason
);

public record ApiKeyCreateRequest(string Name, List<string> Scopes);

public record ApiKeyResponse(string KeyId, string Name, string RawApiKey, string CreatedAt);
