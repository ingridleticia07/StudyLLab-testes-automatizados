using Serilog;
using StudyLabAPI.Endpoints;
using StudyLabAPI.Endpoints.AuthEndpoints;
using StudyLabAPI.Middlewares.Auth;
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
builder.Logging.ClearProviders()
    .AddSerilog(serilog);
builder.Host.UseSerilog(serilog);

builder.Services
    .AddApiMetadata()
    .AddServicesConfiguration(builder.Configuration)
    .ConfigureServices()
    .AddOtMetrics()
    .AddCustomCors();

builder.Services.AddStorageServices()
    .AddLocalServices()
    .AddMappers()
    .AddValidators()
    .AddApiControllers()
    .AddApiRepositories();

builder.Services.AddAuth();

builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
});

WebApplication app = builder.Build();

if(app.Environment.IsDevelopment())
{
    app
        .UseSwagger()
        .UseSwaggerUI();
}

app.MapPrometheusScrapingEndpoint();
app
    .UseCors()
    .UseAuthentication()
    .UseAuthorization();

app.UseAntiforgery();

app.UseStaticFiles();

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
