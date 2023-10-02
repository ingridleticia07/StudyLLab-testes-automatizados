using Microsoft.Extensions.Primitives;

namespace StudyLabAPI.Filters;

public class ApiKeyFilter : IEndpointFilter
{
    private const string API_KEY = "e24dd2210803b4737a9bd9e3163a4ca807b63201c3bc32b68fb122ca52efff36";
    
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        bool hasApiKey = context.HttpContext.Request.Headers
            .TryGetValue(ApiFiltersConsts.API_KEY_REQUEST_HEADER, out StringValues keys);
        
        string? headerApiKey = hasApiKey ? keys.FirstOrDefault() : null;
        if(!hasApiKey || !API_KEY.Equals(headerApiKey))
            return Results.Unauthorized();

        return await next(context);
    }
}