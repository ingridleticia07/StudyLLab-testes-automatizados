using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Models.Options;
using StudyLabAPI.Utils;
using JwtPayload = StudyLabAPI.Services.Jwt.Models.JwtPayload;

namespace StudyLabAPI.Services.Jwt;

public class JwtService : IJwtService
{
    private readonly JwtParametersOptions _options;
    private readonly string _privateKey;

    private SigningCredentials credentials
    {
        get
        {
            byte[] privateKeyByte = Encoding.ASCII.GetBytes(_privateKey);
            
            return new(new SymmetricSecurityKey(privateKeyByte), SecurityAlgorithms.HmacSha256);
        }
    }

    public JwtService(IOptions<JwtParametersOptions> options)
    {
        _options = options.Value;
        _privateKey = EnvVars.GetJwtKey() ?? 
                     throw new EnvironmentVariableIsNullOrEmptyException(nameof(EnvVars.JWT_KEY));
    }
    
    public string GenerateJwt(JwtPayload payload)
    {
        JwtSecurityTokenHandler tokenHandler = new();
        
        SecurityToken securityToken = tokenHandler.CreateToken(new()
        {
            SigningCredentials = credentials,
            Issuer = _options.issuer,
            IssuedAt = DateTime.Now,
            Expires = DateTime.Now.AddDays(1),
            Audience = _options.audience,
            Subject = payload.CreateClaimsIdentity()
        });
        
        return tokenHandler.WriteToken(securityToken);
    }
}