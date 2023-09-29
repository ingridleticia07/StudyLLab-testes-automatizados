using Microsoft.AspNetCore.OutputCaching;

namespace StudyLabAPI.Middlewares.Cache;

public static class OutputCachePolicy
{
    public const string USER_GET_USER_BY_ID_POLICY = "user_get_userById";
    
    public static IServiceCollection AddOutputCacheCustom(this IServiceCollection services)
    {
        services.AddOutputCache(options =>
        {
            options.AddBasePolicy(CustomCachePolicy.Instance);
            options.AddPolicy(USER_GET_USER_BY_ID_POLICY, UserCachePolicies.CacheGetUserById, false);
        });
        
        return services;
    }
}

file static class UserCachePolicies
{
    public static void CacheGetUserById(OutputCachePolicyBuilder builder)
    {
        builder.SetVaryByRouteValue("id");
    }
}