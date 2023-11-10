using StudyLabAPI.Services.Jwt.Models;

namespace StudyLabAPI.Services.Jwt;

public interface IJwtService
{
    public string GenerateJwt(JwtPayload payload);
}