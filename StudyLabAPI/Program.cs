using Serilog;
using StudyLabAPI.Endpoints;
using StudyLabAPI.Endpoints.AuthEndpoints;
using StudyLabAPI.Middlewares.Cors;
using StudyLabAPI.Middlewares.Filters;
using StudyLabAPI.Services;
using Microsoft.AspNetCore.HttpOverrides;
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


// =========================================================
// 1. CONFIGURAÇÃO NECESSÁRIA PARA RENDER/CLOUDFLARE
// =========================================================
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;

    // permite proxies (Render + Cloudflare)
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});


// =========================================================
// 2. ANTIFORGERY COMPLETO PARA FUNCIONAR EM DOMÍNIOS DIFERENTES
// =========================================================
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = ".AspNetCore.Antiforgery.KeSRHT2WmJs";
    // Essencial para cookies cross-site
    options.Cookie.HttpOnly = false;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.None;
});


WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// =========================================================
// 3. ESSENCIAL: habilitar leitura correta de HTTPS real
// =========================================================
app.UseForwardedHeaders();


// =========================================================
// 4. ANTIFORGERY MIDDLEWARE
// =========================================================
app.UseAntiforgery();

app.MapPrometheusScrapingEndpoint();

app.UseCors(CorsPoliciesName.ALLOW_ALL_CORS_POLICY);
app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();


// =========================================================
// ENDPOINT GROUPS
// =========================================================

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
    .WithTags("Material");
materialGroup.MapMaterialEndpoints();

RouteGroupBuilder utilsGroup = app.MapGroup("utils")
    .AddEndpointFilter<ApiKeyFilter>()
    .RequireCors(CorsPoliciesName.ALLOW_ALL_CORS_POLICY)
    .WithTags("Utils");
utilsGroup.MapUtilsEndpoints();

app.Run();
