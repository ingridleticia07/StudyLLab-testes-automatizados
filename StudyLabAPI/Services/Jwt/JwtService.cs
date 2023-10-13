using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using StudyLabAPI.Models.Options;
using JwtPayload = StudyLabAPI.Services.Jwt.Models.JwtPayload;

namespace StudyLabAPI.Services.Jwt;

public class JwtService
{
    private readonly JwtParametersOptions options;

    private SigningCredentials credentials
    {
        get
        {
            byte[] privateKeyByte = Encoding.ASCII.GetBytes(options.privateKey);
            
            return new(new SymmetricSecurityKey(privateKeyByte), SecurityAlgorithms.HmacSha256);
        }
    }

    public JwtService(IOptions<JwtParametersOptions> options)
    {
        this.options = options.Value;
    }
    
    public string GenerateJwt(JwtPayload payload)
    {
        JwtSecurityTokenHandler tokenHandler = new();
        
        SecurityToken securityToken = tokenHandler.CreateToken(new()
        {
            SigningCredentials = credentials,
            Issuer = options.issuer,
            IssuedAt = DateTime.Now,
            Expires = DateTime.Now.AddHours(5),
            Audience = options.audience,
            Subject = payload.CreateClaimsIdentity()
        });
        
        return tokenHandler.WriteToken(securityToken);
    }
}