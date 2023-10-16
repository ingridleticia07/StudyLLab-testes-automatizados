using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using StudyLabAPI.Context;
using StudyLabAPI.Controllers;
using StudyLabAPI.Middlewares.Auth;
using StudyLabAPI.Middlewares.Swagger;
using StudyLabAPI.Models.Options;
using StudyLabAPI.Repositories;
using StudyLabAPI.Services.Email;
using StudyLabAPI.Services.Jwt;
using Swashbuckle.AspNetCore.SwaggerGen;

// ReSharper disable UnusedMethodReturnValue.Global

namespace StudyLabAPI.Services;

public static class Di
{
    public static IServiceCollection AddServicesConfiguration(this IServiceCollection services, 
        IConfiguration configuration)
    {
        services.Configure<JwtParametersOptions>(
            configuration.GetSection(JwtParametersOptions.JWT_PARAMETERS));
        services.Configure<EmailOptions>(configuration.GetSection(EmailOptions.SERVER_EMAIL));
        services.Configure<ConnectionStringsOptions>(configuration
            .GetSection(ConnectionStringsOptions.CONNECTION_STRING));
        
        return services;
    }
    public static IServiceCollection ConfigureServices(this IServiceCollection services)
    {
        services.AddTransient<IConfigureOptions<SwaggerGenOptions>, SwaggerConfiguration>();
        services.AddTransient<IConfigureOptions<JwtBearerOptions>, AuthenticationJwtBearerConfiguration>();
        
        return services;
    }
    
    public static IServiceCollection AddApiMetadata(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        return services;
    }
    
    public static IServiceCollection AddStorageServices(this IServiceCollection services)
    {
        services.AddDbContext<AppDbContext>();
        
        return services;
    }
    
    public static IServiceCollection AddLocalServices(this IServiceCollection services)
    {
        services.AddSingleton<JwtService>();
        services.AddTransient<EmailService>();
        
        return services;
    }
    
    public static IServiceCollection AddAuth(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE,
                AuthorizationPolicies.RequireIdentifierAndUserRole);
            options.AddPolicy(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_ADMIN_ROLE,
                AuthorizationPolicies.RequireIdentifierAndAdminRole);
            options.AddPolicy(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_DEV_ROLE,
                AuthorizationPolicies.RequireIdentifierAndDevRole);
        });
        
        services.AddAuthentication(options =>
        {
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer();
        return services;
    }
    
    public static IServiceCollection AddApiRepositories(this IServiceCollection services)
    {
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<ICursoRepository, CursoRepository>();
        
        return services;
    }
    
    public static IServiceCollection AddApiControllers(this IServiceCollection services)
    {
        services.AddScoped<IUsuarioController, UsuarioController>();
        services.AddScoped<IAuthController, AuthController>();
        
        return services;
    }
}