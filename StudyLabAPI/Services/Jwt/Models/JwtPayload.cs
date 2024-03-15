using System.Security.Claims;
using StudyLabAPI.Models.Enums;

namespace StudyLabAPI.Services.Jwt.Models;

public record JwtPayload(string userId, UserRole role)
{
    public ClaimsIdentity CreateClaimsIdentity()
    {
        ClaimsIdentity claims = new();
        claims.AddClaims(new Claim[]
        {
            new(ClaimTypes.Name, userId),
            new(ClaimTypes.Role, role.ToString())
        });
        
        return claims;
    }
}