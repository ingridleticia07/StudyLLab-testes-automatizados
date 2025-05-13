using Microsoft.AspNetCore.Cors.Infrastructure;

namespace StudyLabAPI.Middlewares.Cors;

public static class CorsPolicy
{
    public static IServiceCollection AddCustomCors(this IServiceCollection services, IConfiguration configuration)
    {
        var allowedOrigins = configuration.GetSection("CorsParameters:AllowedOrigins").Get<string[]>();

        services.AddCors(options =>
        {
            options.AddPolicy(CorsPoliciesName.ALLOW_ALL_CORS_POLICY,
                builder => CustomCorsPolicies.AllowAllCorsPolicy(builder, allowedOrigins));
        });

        return services;
    }
}

file static class CustomCorsPolicies
{
    public static void AllowAllCorsPolicy(CorsPolicyBuilder builder, string[] allowedOrigin)
    {
        builder.WithOrigins(allowedOrigin)
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials();
    }
}