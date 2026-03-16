using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.HttpOverrides;
using Serilog;
using StudyLabAPI.Endpoints;
using StudyLabAPI.Endpoints.AuthEndpoints;
using StudyLabAPI.Middlewares.Cors;
using StudyLabAPI.Middlewares.Filters;
using StudyLabAPI.Services;
using ILogger = Serilog.ILogger;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

ILogger serilog = new LoggerConfiguration()
    .Enrich.WithMachineName()
    .Enrich.WithEnvironmentName()
    .WriteTo.Console()
    .CreateLogger();

builder.Logging.ClearProviders().AddSerilog(serilog);
builder.Host.UseSerilog(serilog);

builder.Services
    .AddApiMetadata()
    .AddServicesConfiguration(builder.Configuration)
    .ConfigureServices()
    .AddOtMetrics()
    .AddCustomCors(builder.Configuration)
    .AddSupabaseStorage(builder.Configuration);

builder.Services.AddStorageServices()
    .AddLocalServices()
    .AddMappers()
    .AddValidators()
    .AddApiControllers()
    .AddApiRepositories();

builder.Services.AddAuth();


// ========================================
// 1. Forwarded Headers (Render + Cloudflare)
// ========================================
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;

    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

WebApplication app = builder.Build();


// ========================================
// 2. ForwardedHeaders logo de início
// ========================================
app.UseForwardedHeaders();

// Middleware que corrige o Scheme baseado no X-Forwarded-Proto
app.Use((context, next) =>
{
    var proto = context.Request.Headers["X-Forwarded-Proto"].FirstOrDefault();

    if (!string.IsNullOrEmpty(proto))
        context.Request.Scheme = proto;

    return next();
});


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ========================================
// 3. CORS
// ========================================
app.UseCors(CorsPoliciesName.ALLOW_ALL_CORS_POLICY);


app.MapPrometheusScrapingEndpoint();

app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();


// ========================================
// Endpoints
// ========================================
RouteGroupBuilder authGroup = app.MapGroup("auth")
    .AddEndpointFilter<ApiKeyFilter>()
    .RequireCors(CorsPoliciesName.ALLOW_ALL_CORS_POLICY)
    .WithTags("Autenticação");
authGroup.MapAuthenticationEndpoints();

RouteGroupBuilder userGroup = app.MapGroup("user")
    .AddEndpointFilter<ApiKeyFilter>()
    .RequireCors(CorsPoliciesName.ALLOW_ALL_CORS_POLICY)
    .WithTags("Usuário");
userGroup.MapUserEndpoints();

RouteGroupBuilder disciplinaGroup = app.MapGroup("disciplina")
    .AddEndpointFilter<ApiKeyFilter>()
    .RequireCors(CorsPoliciesName.ALLOW_ALL_CORS_POLICY)
    .WithTags("Disciplina");
disciplinaGroup.MapDisciplinaEndpoints();

RouteGroupBuilder forumGroup = app.MapGroup("forum")
    .AddEndpointFilter<ApiKeyFilter>()
    .RequireCors(CorsPoliciesName.ALLOW_ALL_CORS_POLICY)
    .WithTags("Forum");
forumGroup.MapForumEndpoints();

RouteGroupBuilder materialGroup = app.MapGroup("material")
    .AddEndpointFilter<ApiKeyFilter>()
    .RequireCors(CorsPoliciesName.ALLOW_ALL_CORS_POLICY)
    .WithTags("Material").DisableAntiforgery();
materialGroup.MapMaterialEndpoints();

RouteGroupBuilder utilsGroup = app.MapGroup("utils")
    .AddEndpointFilter<ApiKeyFilter>()
    .RequireCors(CorsPoliciesName.ALLOW_ALL_CORS_POLICY)
    .WithTags("Utils");
utilsGroup.MapUtilsEndpoints();

app.Run();
