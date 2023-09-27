using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using StudyLabAPI.Context;
using StudyLabAPI.Endpoints;
using StudyLabAPI.Middlewares.Auth;
using StudyLabAPI.Middlewares.Cache;
using StudyLabAPI.Middlewares.Swagger;
using StudyLabAPI.Services.Configuration;
using StudyLabAPI.Services.Email;
using StudyLabAPI.Services.Jwt;
using Swashbuckle.AspNetCore.SwaggerGen;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>((provider, optionsBuilder) =>
{
    ILogger? logger = provider.GetService<ILogger>();
    
    string? connectionString = builder.Configuration.GetConnectionString("PostgresDbConnString");
    if(string.IsNullOrEmpty(connectionString))
        logger?.LogWarning("String de conexão com o banco de dados não especificada");
    
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
        logger?.LogWarning("Parâmetros do JWT não especificados");
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
        logger?.LogWarning("Email do servidor não especificado");
        emailOptions = new();
    }
    
    return new(emailOptions.smtpServer, emailOptions.port, 
        emailOptions.email, emailOptions.password);
});
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_NAME_POLICY, 
        AuthorizationPolicies.RequireIdentifierAndName);
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

builder.Services.AddOutputCacheWCustomPolicy();
WebApplication app = builder.Build();

if(app.Environment.IsDevelopment())
{
    app.UseStaticFiles();
    app.UseSwagger();
    app.UseSwaggerUI(options => options.InjectStylesheet("/feeling-blue.css"));
}

app.UseAuthentication();
app.UseAuthorization();
app.UseOutputCache();

RouteGroupBuilder authGroup = app.MapGroup("auth")
    .WithTags("Autenticação")
    .AllowAnonymous();
authGroup.MapAuthEndpoints();

RouteGroupBuilder userGroup = app.MapGroup("user")
    .WithTags("Usuário")
    .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_NAME_POLICY);
userGroup.MapUserEndpoints();

app.MapGet("jwt/test",
    (HttpContext context) =>
    {
        string userId = context.User.Claims.First(claim => claim.Type == JwtClaims.IDENTIFIER).Value;
        string email = context.User.Claims.First(claim => claim.Type == JwtClaims.NAME).Value;
        
        return Results.Ok($"{email} ({userId})");
    })
    .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_NAME_POLICY);

app.Run();
