using Microsoft.Extensions.Primitives;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Utils;

namespace StudyLabAPI.Middlewares.Filters;

public class ApiKeyFilter : IEndpointFilter
{
    private readonly string? _apiKey = EnvVars.GetApiKey();
    
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        if(_apiKey is null)
            throw new EnvironmentVariableIsNullOrEmptyException(nameof(_apiKey));
        bool hasApiKey = context.HttpContext.Request.Headers
            .TryGetValue(ApiFiltersConsts.API_KEY_REQUEST_HEADER, out StringValues keys);
        
        string? headerApiKey = hasApiKey ? keys.FirstOrDefault() : null;
        if(!hasApiKey || !_apiKey.Equals(headerApiKey))
            return Results.Unauthorized();

        return await next(context);
    }
}