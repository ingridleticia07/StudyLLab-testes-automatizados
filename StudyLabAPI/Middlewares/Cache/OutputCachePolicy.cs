using Microsoft.AspNetCore.OutputCaching;

namespace StudyLabAPI.Middlewares.Cache;

public static class OutputCachePolicy
{
    public const string USER_GET_USER_BY_ID_POLICY = "user_get_userById";
    
    public static IServiceCollection AddOutputCacheWCustomPolicy(this IServiceCollection services)
    {
        services.AddOutputCache(options =>
        {
            options.AddBasePolicy(builder =>
            {
                builder.Expire(TimeSpan.FromSeconds(10));
                builder.NoCache();
            });
            options.AddPolicy(USER_GET_USER_BY_ID_POLICY, UserCachePolicies.CacheGetUserById);
        });
        
        return services;
    }
}

file static class UserCachePolicies
{
    public static void CacheGetUserById(OutputCachePolicyBuilder builder)
    {
        builder.SetVaryByRouteValue("id");
        builder.Tag(CacheTags.CACHE_USER_TAG);
    }
}