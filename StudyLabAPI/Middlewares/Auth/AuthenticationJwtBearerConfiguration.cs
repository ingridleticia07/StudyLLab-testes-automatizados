using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using StudyLabAPI.Models.Options;

namespace StudyLabAPI.Middlewares.Auth;

public class AuthenticationJwtBearerConfiguration : IConfigureNamedOptions<JwtBearerOptions>
{
    private readonly JwtParametersOptions jwtOptions;

    public AuthenticationJwtBearerConfiguration(IOptions<JwtParametersOptions> jwtOptions)
    {
        this.jwtOptions = jwtOptions.Value;
    }
    
    public void Configure(string? name, JwtBearerOptions options)
    {
        byte[] privateKeyByte = Encoding.ASCII.GetBytes(jwtOptions.privateKey);
    
        options.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidateAudience = true,
            ValidIssuer = jwtOptions.issuer,
            ValidAudience = jwtOptions.audience,
            IssuerSigningKey = new SymmetricSecurityKey(privateKeyByte),
            ValidAlgorithms = new []{ SecurityAlgorithms.HmacSha256 }
        };
    }
    
    public void Configure(JwtBearerOptions options) =>
        Configure(JwtBearerDefaults.AuthenticationScheme, options);
}