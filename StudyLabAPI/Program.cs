using Serilog;
using StudyLabAPI.Endpoints;
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
    .AddCustomCors();

builder.Services.AddStorageServices()
    .AddLocalServices()
    .AddMappers()
    .AddValidators()
    .AddApiControllers()
    .AddApiRepositories();

builder.Services.AddAuth();

WebApplication app = builder.Build();

if(app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors()
    .UseAuthentication()
    .UseAuthorization();

RouteGroupBuilder authGroup = app.MapGroup("auth")
    .AddEndpointFilter<ApiKeyFilter>()
    .RequireCors(CorsPoliciesName.ALLOW_ALL_CORS_POLICY)
    .WithTags("Autenticação")
    .AllowAnonymous();
authGroup.MapAuthEndpoints();

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

app.Run();
