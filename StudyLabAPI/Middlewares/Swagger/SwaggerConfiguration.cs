using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace StudyLabAPI.Middlewares.Swagger;

public class SwaggerConfiguration : IConfigureOptions<SwaggerGenOptions>
{
    public void Configure(SwaggerGenOptions options)
    {
        options.AddSecurityDefinition("Bearer", new()
        {
            In = ParameterLocation.Header,
            Description = "Cabeçalho de autenticação JWT usando Bearer.",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "Bearer"
        });
        options.AddSecurityDefinition("ApiKey", new()
        {
            In = ParameterLocation.Header,
            Description = "Cabeçalho de autenticação usando ApiKey.",
            Name = "x-api-key",
            Type = SecuritySchemeType.ApiKey,
            Scheme = "ApiKeyScheme"
        });
        
        options.AddSecurityRequirement(new()
        {
            {
                new()
                {
                    Reference = new()
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
        options.AddSecurityRequirement(new()
        {
            {
                new()
                {
                    Reference = new()
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "ApiKey"
                    }
                },
                Array.Empty<string>()
            }
        });
    }
}