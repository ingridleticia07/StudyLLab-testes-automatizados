using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using StudyLabAPI.Models.Enums;

namespace StudyLabAPI.Middlewares.Auth;

public static class AuthorizationPolicies
{
    /// <summary>
    /// Requer que a requisição esteja autenticada e que o usuário tenha o papel de <see cref="UserRole.User"/> ou <see cref="UserRole.Admin"/>.
    /// </summary>
    public const string REQUIRE_IDENTIFIER_AND_USER_ROLE = "RequireIdentifierAndUserRole";
    /// <summary>
    /// Requer que a requisição esteja autenticada e que o usuário tenha o papel de <see cref="UserRole.Admin"/>.
    /// </summary>
    public const string REQUIRE_IDENTIFIER_AND_ADMIN_ROLE = "RequireIdentifierAndAdminRole";
    /// <summary>
    /// Requer que a requisição esteja autenticada e que o usuário tenha o papel de <see cref="UserRole.Prof"/>.
    /// </summary>
    public const string REQUIRE_IDENTIFIER_AND_PROF_ROLE = "RequireIdentifierAndProfRole";
    
    public static void RequireIdentifierAndUserRole(AuthorizationPolicyBuilder builder)
    {
        builder.RequireClaim(ClaimTypes.Name);
        builder.RequireRole(UserRole.User.ToString(), UserRole.Admin.ToString());
    }
    public static void RequireIdentifierAndAdminRole(AuthorizationPolicyBuilder builder)
    {
        builder.RequireClaim(ClaimTypes.Name);
        builder.RequireRole(UserRole.Admin.ToString());
    }
    public static void RequireIdentifierAndProfRole(AuthorizationPolicyBuilder builder)
    {
        builder.RequireClaim(ClaimTypes.Name);
        builder.RequireRole(UserRole.Prof.ToString());
    }
}