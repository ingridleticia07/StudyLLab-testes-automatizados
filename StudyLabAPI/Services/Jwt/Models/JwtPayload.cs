using System.Security.Claims;

namespace StudyLabAPI.Services.Jwt.Models;

public record JwtPayload(string userId, string username)
{
    public ClaimsIdentity CreateClaimsIdentity()
    {
        ClaimsIdentity claims = new();
        claims.AddClaims(new Claim[]
        {
            new(JwtClaims.IDENTIFIER, userId),
            new(JwtClaims.NAME, username)
        });
        
        return claims;
    }
}