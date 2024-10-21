using Microsoft.AspNetCore.Cors.Infrastructure;

namespace StudyLabAPI.Middlewares.Cors;

public static class CorsPolicy
{
    public static IServiceCollection AddCustomCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(CorsPoliciesName.ALLOW_ALL_CORS_POLICY, 
                CustomCorsPolicies.AllowAllCorsPolicy);
        });
        return services;
    }
}

file static class CustomCorsPolicies
{
    public static void AllowAllCorsPolicy(CorsPolicyBuilder builder)
    {
        builder.WithOrigins("http://localhost:5500")
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials();
    }
}