using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using StudyLabAPI.Context;
using StudyLabAPI.Controllers;
using StudyLabAPI.Mapper;
using StudyLabAPI.Middlewares.Auth;
using StudyLabAPI.Middlewares.Swagger;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Options;
using StudyLabAPI.Repositories;
using StudyLabAPI.Services.Email;
using StudyLabAPI.Services.Hash;
using StudyLabAPI.Services.Jwt;
using StudyLabAPI.Utils;
using StudyLabAPI.Validators;
using Swashbuckle.AspNetCore.SwaggerGen;

// ReSharper disable UnusedMethodReturnValue.Global

namespace StudyLabAPI.Services;

public static class Di
{
    /// <summary>
    /// Adiciona as configurações de serviços a partir do arquivo de
    /// configuração correspondente ao ambiente de execução.
    /// </summary>
    /// <param name="configuration">Gerenciador de configuração do <see cref="WebApplicationBuilder"/></param>
    /// <returns><see cref="IServiceCollection"/> para que outras chamadas possam ser encadeadas.</returns>
    public static IServiceCollection AddServicesConfiguration(this IServiceCollection services, 
        IConfiguration configuration)
    {
        services.Configure<JwtParametersOptions>(
            configuration.GetSection(JwtParametersOptions.JWT_PARAMETERS));
        services.Configure<Argon2HashParametersOptions>(
            configuration.GetSection(Argon2HashParametersOptions.HASH_PARAMETERS));
        
        return services;
    }
    /// <summary>
    /// Adiciona classes de configurações criadas a partir de <see cref="IConfigureOptions{TOptions}"/>
    /// ao container de DI.
    /// </summary>
    /// <returns><see cref="IServiceCollection"/> para que outras chamadas possam ser encadeadas.</returns>
    public static IServiceCollection ConfigureServices(this IServiceCollection services)
    {
        services.AddTransient<IConfigureOptions<SwaggerGenOptions>, SwaggerConfiguration>();
        services.AddTransient<IConfigureOptions<JwtBearerOptions>, AuthenticationJwtBearerConfiguration>();
        
        return services;
    }
    /// <summary>
    /// Adiciona serviços para exportação de métricas ao container de DI, usando o OpenTelemetry.
    /// </summary>
    /// <returns><see cref="IServiceCollection"/> para que outras chamadas possam ser encadeadas.</returns>
    public static IServiceCollection AddOtMetrics(this IServiceCollection services)
    {
        services.AddOpenTelemetry()
            .ConfigureResource(b =>
            {
                b.AddService("StudyLabAPI");
            })
            .WithTracing(t =>
            {
                t.AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddEntityFrameworkCoreInstrumentation()
                    .AddOtlpExporter();
            })
            .WithMetrics(m =>
            {
                m.AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddRuntimeInstrumentation()
                    .AddProcessInstrumentation()
                    .AddPrometheusExporter();
            });

        return services;
    }
    /// <summary>
    /// Adiciona metadados para geração de código.
    /// </summary>
    /// <returns><see cref="IServiceCollection"/> para que outras chamadas possam ser encadeadas.</returns>
    public static IServiceCollection AddApiMetadata(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        return services;
    }
    /// <summary>
    /// Adiciona serviços de armazenamento de dados ao container de DI.
    /// </summary>
    /// <returns><see cref="IServiceCollection"/> para que outras chamadas possam ser encadeadas.</returns>
    public static IServiceCollection AddStorageServices(this IServiceCollection services)
    {
        services.AddDbContextFactory<AppDbContext>();
        services.AddDbContext<AppDbContext>();
        
        return services;
    }
    /// <summary>
    /// Adiciona serviços criados localmente (na solução) ao container de DI.
    /// </summary>
    /// <returns><see cref="IServiceCollection"/> para que outras chamadas possam ser encadeadas.</returns>
    public static IServiceCollection AddLocalServices(this IServiceCollection services)
    {
        services.AddSingleton<IJwtService, JwtService>();
        services.AddTransient<IEmailService, EmailService>();
        services.AddSingleton<IHashService, ArgonHashService>();
        services.AddSingleton<EnvironmentService>(_ => 
            EnvVars.CreateEnvironmentServiceFromVariables());
        
        return services;
    }
    /// <summary>
    /// Adiciona mapeadores de objetos ao container de DI.
    /// </summary>
    /// <returns><see cref="IServiceCollection"/> para que outras chamadas possam ser encadeadas.</returns>
    public static IServiceCollection AddMappers(this IServiceCollection services)
    {
        services.AddTransient<DisciplinaModelMapper>();
        services.AddTransient<TopicoDiscussaoModelMapper>();
        services.AddTransient<RespotaForumModelMapper>();
        services.AddTransient<UsuarioModelMapper>();
        services.AddTransient<RegisterUserRequestModelMapper>();
        services.AddTransient<CodigoUsuarioModelMapper>();
        services.AddTransient<ResetUserPasswordRequestModelMapper>();

        return services;
    }
    /// <summary>
    /// Adiciona validadores de modelos ao container de DI
    /// </summary>
    /// <returns><see cref="IServiceCollection"/> para que outras chamadas possam ser encadeadas.</returns>
    public static IServiceCollection AddValidators(this IServiceCollection services)
    {
        services.AddScoped<IValidator<RegisterUserRequestModel>, RegisterUserRequestModelValidator>();
        services.AddScoped<IValidator<UserLoginRequestModel>, UserLoginRequestModelValidator>();
        services.AddScoped<IValidator<ConfirmUserEmailRequestModel>, ConfirmUserEmailRequestModelValidator>();
        services.AddScoped<IValidator<ResetUserPasswordRequestModel>, ResetUserPasswordRequestModelValidator>();
        services.AddScoped<IValidator<UpdateUserRequestModel>, UpdateUserRequestModelValidator>();
        
        return services;
    }
    /// <summary>
    /// Adiciona e configura autenticação e autorização.
    /// </summary>
    /// <returns><see cref="IServiceCollection"/> para que outras chamadas possam ser encadeadas.</returns>
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
    /// <summary>
    /// Adiciona repositórios de acesso a dados ao container de DI.
    /// </summary>
    /// <returns><see cref="IServiceCollection"/> para que outras chamadas possam ser encadeadas.</returns>
    public static IServiceCollection AddApiRepositories(this IServiceCollection services)
    {
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<ICursoRepository, CursoRepository>();
        services.AddScoped<IDisciplinaRepository, DisciplinaRepository>();
        services.AddScoped<ICodigoUsuarioRepository, CodigoUsuarioRepository>();
        services.AddScoped<ITopicoDiscussaoRepository,TopicoDiscussaoRepository>();
        services.AddScoped<IRespostaForumRepository, RespostaForumRepository>();
        services.AddScoped<IForumRepository, ForumRepository>();
        services.AddScoped<IDocumentoRepository, DocumentoRepository>();
        return services;
    }
    /// <summary>
    /// Adiciona controladores dos endpoints da API ao container de DI.
    /// </summary>
    /// <returns><see cref="IServiceCollection"/> para que outras chamadas possam ser encadeadas.</returns>
    public static IServiceCollection AddApiControllers(this IServiceCollection services)
    {
        services.AddScoped<IUsuarioController, UsuarioController>();
        services.AddScoped<IAuthController, AuthController>();
        services.AddScoped<IDisciplinaController, DisciplinaController>();
        services.AddScoped<IForumController, ForumController>();
        services.AddScoped<IDocumentoController, DocumentoController>();
        services.AddScoped<IUtilsController, UtilsController>();
        return services;
    }
}