using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using StudyLabAPI.Models.Options;
using StudyLabAPI.Services;

namespace StudyLabAPI.Middlewares.Auth;

public class AuthenticationJwtBearerConfiguration : IConfigureNamedOptions<JwtBearerOptions>
{
    private readonly JwtParametersOptions _jwtOptions;
    private readonly string _privateKey;

    public AuthenticationJwtBearerConfiguration(IOptions<JwtParametersOptions> jwtOptions,
        EnvironmentService environmentService)
    {
        _jwtOptions = jwtOptions.Value;
        _privateKey = environmentService.jwtKey;
    }
    
    public void Configure(string? name, JwtBearerOptions options)
    {
        byte[] privateKeyByte = Encoding.ASCII.GetBytes(_privateKey);
    
        options.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidateAudience = true,
            ValidIssuer = _jwtOptions.issuer,
            ValidAudience = _jwtOptions.audience,
            IssuerSigningKey = new SymmetricSecurityKey(privateKeyByte),
            ValidAlgorithms = new []{ SecurityAlgorithms.HmacSha256 }
        };
    }
    
    public void Configure(JwtBearerOptions options) =>
        Configure(JwtBearerDefaults.AuthenticationScheme, options);
}