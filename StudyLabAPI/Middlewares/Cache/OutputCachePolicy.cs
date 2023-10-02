using Microsoft.AspNetCore.OutputCaching;

namespace StudyLabAPI.Middlewares.Cache;

public static class OutputCachePolicy
{
    private const string USER_GET_USER_BY_ID_POLICY = "user_get_userById";
    private const string NO_AUTH_REQUIRED_POLICY = "no_auth_required";
    
    public static IServiceCollection AddOutputCacheCustom(this IServiceCollection services)
    {
        services.AddOutputCache(options =>
        {
            options.AddBasePolicy(builder =>
            {
                builder.NoCache();
            });
            options.AddPolicy(NO_AUTH_REQUIRED_POLICY, CustomCachePolicy.Instance);
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