using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TalentOS.IdentityService.Services;

public interface IJwtTokenGenerator
{
    string GenerateToken(string userId, string email, string role, string tenantId, string department);
}

public class JwtTokenGenerator : IJwtTokenGenerator
{
    private const string SecretKey = "talentos_master_enterprise_secret_key_2026";

    public string GenerateToken(string userId, string email, string role, string tenantId, string department)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(SecretKey);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId),
            new(ClaimTypes.Email, email),
            new(ClaimTypes.Role, role),
            new("tenant_id", tenantId),
            new("department", department),
            new("iss", "TalentOS.IdentityService"),
            new("aud", "TalentOS.Enterprise")
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(8),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
