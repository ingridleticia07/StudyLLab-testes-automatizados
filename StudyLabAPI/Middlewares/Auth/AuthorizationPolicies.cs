using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using StudyLabAPI.Models.Enums;

namespace StudyLabAPI.Middlewares.Auth;

public static class AuthorizationPolicies
{
    public const string REQUIRE_IDENTIFIER_AND_USER_ROLE = "RequireIdentifierAndUserRole";
    public const string REQUIRE_IDENTIFIER_AND_ADMIN_ROLE = "RequireIdentifierAndAdminRole";
    public const string REQUIRE_IDENTIFIER_AND_DEV_ROLE = "RequireIdentifierAndDevRole";
    
    public static void RequireIdentifierAndUserRole(AuthorizationPolicyBuilder builder)
    {
        builder.RequireClaim(ClaimTypes.Name);
        builder.RequireRole(UserRole.User.ToString());
    }
    public static void RequireIdentifierAndAdminRole(AuthorizationPolicyBuilder builder)
    {
        builder.RequireClaim(ClaimTypes.Name);
        builder.RequireRole(UserRole.Admin.ToString());
    }
    public static void RequireIdentifierAndDevRole(AuthorizationPolicyBuilder builder)
    {
        builder.RequireClaim(ClaimTypes.Name);
        builder.RequireRole(UserRole.Dev.ToString());
    }
}