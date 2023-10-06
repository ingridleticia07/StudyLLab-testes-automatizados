using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using StudyLabAPI.Context;
using StudyLabAPI.Controllers;
using StudyLabAPI.Endpoints;
using StudyLabAPI.Filters;
using StudyLabAPI.Middlewares.Auth;
using StudyLabAPI.Middlewares.Cache;
using StudyLabAPI.Middlewares.Swagger;
using StudyLabAPI.Repositories;
using StudyLabAPI.Services.Configuration;
using StudyLabAPI.Services.Email;
using StudyLabAPI.Services.Jwt;
using Swashbuckle.AspNetCore.SwaggerGen;
using ILogger = Serilog.ILogger;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

ILogger serilog = new LoggerConfiguration()
    .Enrich.WithMachineName()
    .Enrich.WithEnvironmentName()
    .WriteTo.Console()
    .CreateLogger();
builder.Logging.ClearProviders();
builder.Logging.AddSerilog(serilog);
builder.Host.UseSerilog(serilog);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>((provider, optionsBuilder) =>
{
    ILogger? logger = provider.GetService<ILogger>();
    
    string? connectionString = builder.Configuration.GetConnectionString("PostgresDbConnString");
    if(string.IsNullOrEmpty(connectionString))
        logger?.Warning("String de conexão com o banco de dados não especificada");
    
    optionsBuilder.UseNpgsql(connectionString);
});
builder.Services.AddSingleton<JwtService>(provider =>
{
    ILogger? logger = provider.GetService<ILogger>();
    
    JwtParametersOptions? jwtOptions = 
    builder.Configuration
        .GetSection(JwtParametersOptions.JWT_PARAMETERS)
        .Get<JwtParametersOptions>();
    if(jwtOptions is null)
    {
        logger?.Warning("Parâmetros do JWT não especificados");
        jwtOptions = new();
    }
    
    return new(jwtOptions.privateKey, jwtOptions.issuer, jwtOptions.audience);
});
builder.Services.AddTransient<EmailService>(provider =>
{
    ILogger? logger = provider.GetService<ILogger>();
    EmailOptions? emailOptions = builder.Configuration
        .GetSection(EmailOptions.SERVER_EMAIL)
        .Get<EmailOptions>();
    if(emailOptions is null)
    {
        logger?.Warning("Email do servidor não especificado");
        emailOptions = new();
    }
    
    return new(emailOptions.smtpServer, emailOptions.port, 
        emailOptions.email, emailOptions.password);
});
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE,
        AuthorizationPolicies.RequireIdentifierAndUserRole);
    options.AddPolicy(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_ADMIN_ROLE,
        AuthorizationPolicies.RequireIdentifierAndAdminRole);
    options.AddPolicy(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_DEV_ROLE,
        AuthorizationPolicies.RequireIdentifierAndDevRole);
});
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    JwtParametersOptions jwtOptions = 
        builder.Configuration.GetSection(JwtParametersOptions.JWT_PARAMETERS)
            .Get<JwtParametersOptions>()!;
    
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
        ValidAlgorithms = new []{ SecurityAlgorithms.HmacSha256 },
    };
});
builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, SwaggerConfiguration>();

builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();

builder.Services.AddScoped<IUsuarioController, UsuarioController>();

builder.Services.AddOutputCacheCustom();

WebApplication app = builder.Build();

app.UseOutputCache();

if(app.Environment.IsDevelopment())
{
    app.UseStaticFiles();
    app.UseSwagger();
    app.UseSwaggerUI(options => options.InjectStylesheet("/feeling-blue.css"));
}

app.UseAuthentication();
app.UseAuthorization();

RouteGroupBuilder authGroup = app.MapGroup("auth")
    .AddEndpointFilter<ApiKeyFilter>()
    .WithTags("Autenticação")
    .AllowAnonymous();
authGroup.MapAuthEndpoints();

RouteGroupBuilder userGroup = app.MapGroup("user")
    .AddEndpointFilter<ApiKeyFilter>()
    .WithTags("Usuário");
userGroup.MapUserEndpoints();

app.Run();
