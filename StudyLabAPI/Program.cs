using Serilog;
using StudyLabAPI.Endpoints;
using StudyLabAPI.Middlewares.Cache;
using StudyLabAPI.Middlewares.Filters;
using StudyLabAPI.Services;
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

builder.Services.AddApiMetadata();
builder.Services.AddServicesConfiguration(builder.Configuration)
    .ConfigureServices();

builder.Services.AddStorageServices()
    .AddLocalServices()
    .AddMappers()
    .AddValidators()
    .AddApiControllers()
    .AddApiRepositories();

builder.Services.AddAuth()
    .AddOutputCacheCustom();

WebApplication app = builder.Build();

app.UseOutputCache();

if(app.Environment.IsDevelopment())
{
    app.UseStaticFiles();
    app.UseSwagger();
    app.UseSwaggerUI();
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

RouteGroupBuilder disciplinaGroup = app.MapGroup("disciplina")
    .AddEndpointFilter<ApiKeyFilter>()
    .WithTags("Disciplina");
disciplinaGroup.MapDisciplinaEndpoints();

RouteGroupBuilder forumGroup = app.MapGroup("forum")
    .AddEndpointFilter<ApiKeyFilter>()
    .WithTags("Forum");
forumGroup.MapForumEndpoints();

RouteGroupBuilder materialGroup = app.MapGroup("material")
    .AddEndpointFilter<ApiKeyFilter>()
    .WithTags("Material");
materialGroup.MapMaterialEndpoints();

app.Run();
