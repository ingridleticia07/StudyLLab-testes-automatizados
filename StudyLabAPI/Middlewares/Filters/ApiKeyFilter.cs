using Microsoft.Extensions.Primitives;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Utils;

namespace StudyLabAPI.Middlewares.Filters;

public class ApiKeyFilter : IEndpointFilter
{
    private readonly string? apiKey = EnvVars.GetApiKey();
    
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        if(apiKey is null)
            throw new EnvironmentVariableIsNullOrEmptyException(nameof(apiKey));
        bool hasApiKey = context.HttpContext.Request.Headers
            .TryGetValue(ApiFiltersConsts.API_KEY_REQUEST_HEADER, out StringValues keys);
        
        string? headerApiKey = hasApiKey ? keys.FirstOrDefault() : null;
        if(!hasApiKey || !apiKey.Equals(headerApiKey))
            return Results.Unauthorized();

        return await next(context);
    }
}