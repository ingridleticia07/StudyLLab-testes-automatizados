using StudyLabAPI.Services.Jwt.Models;
using System.Security.Claims;

namespace StudyLabAPI.Services.Jwt;

public interface IJwtService
{
    public string GenerateJwt(JwtPayload payload);

    public (string payload, ClaimsIdentity claims) GenerateJwtAndReturnClaims(JwtPayload payload);
}