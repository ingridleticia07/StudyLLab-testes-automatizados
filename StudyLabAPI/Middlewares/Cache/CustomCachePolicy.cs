using Microsoft.AspNetCore.OutputCaching;

namespace StudyLabAPI.Middlewares.Cache;

public sealed class CustomCachePolicy : IOutputCachePolicy
{
    public static readonly CustomCachePolicy Instance = new();
    
    public ValueTask CacheRequestAsync(OutputCacheContext context, CancellationToken cancellation)
    {
        bool attemptOutputCaching = AttemptOutputCaching(context);
        context.EnableOutputCaching = true;
        context.AllowCacheLookup = attemptOutputCaching;
        context.AllowCacheStorage = attemptOutputCaching;
        context.AllowLocking = true;

        // Vary by any query by default
        context.CacheVaryByRules.QueryKeys = "*";

        return ValueTask.CompletedTask;
    }

    public ValueTask ServeFromCacheAsync(OutputCacheContext context, CancellationToken cancellation) =>
        ValueTask.CompletedTask;

    public ValueTask ServeResponseAsync(OutputCacheContext context, CancellationToken cancellation) =>
        ValueTask.CompletedTask;
    
    private bool AttemptOutputCaching(OutputCacheContext context)
    {
        var request = context.HttpContext.Request;

        // Verify the method, we only cache get and head verb
        if (!HttpMethods.IsGet(request.Method) && !HttpMethods.IsHead(request.Method))
        {
            return false;
        }
        // we comment out below code to cache authorization response.
        // Verify existence of authorization headers
        //if (!StringValues.IsNullOrEmpty(request.Headers.Authorization) || request.HttpContext.User?.Identity?.IsAuthenticated == true)
        //{
        //    return false;
        //}
        return true;
    }
}