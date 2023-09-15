using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using JwtPayload = StudyLabAPI.Services.Jwt.Models.JwtPayload;

namespace StudyLabAPI.Services.Jwt;

public class JwtService
{
    private string privateKey { get; set; }
    private string issuer { get; set; }
    private string audience { get; set; }

    private SigningCredentials credentials
    {
        get
        {
            byte[] privateKeyByte = Encoding.ASCII.GetBytes(privateKey);
            
            return new(new SymmetricSecurityKey(privateKeyByte), SecurityAlgorithms.HmacSha256);
        }
    }

    public JwtService(string privateKey, string issuer, string audience)
    {
        this.privateKey = privateKey;
        this.issuer = issuer;
        this.audience = audience;
    }
    
    public string GenerateJwt(JwtPayload payload)
    {
        JwtSecurityTokenHandler tokenHandler = new();
        
        SecurityToken securityToken = tokenHandler.CreateToken(new()
        {
            SigningCredentials = credentials,
            Issuer = issuer,
            IssuedAt = DateTime.Now,
            Expires = DateTime.Now.AddHours(5),
            Audience = audience,
            Subject = payload.CreateClaimsIdentity()
        });
        
        return tokenHandler.WriteToken(securityToken);
    }
}