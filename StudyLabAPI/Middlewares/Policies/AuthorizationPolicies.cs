using Microsoft.AspNetCore.Authorization;
using StudyLabAPI.Services.Jwt;

namespace StudyLabAPI.Middlewares.Policies;

public static class AuthorizationPolicies
{
    public const string REQUIRE_IDENTIFIER_AND_NAME_POLICY = "RequireIdentifierAndName";
    public static void RequireIdentifierAndName(AuthorizationPolicyBuilder builder)
    {
        builder.RequireClaim(JwtClaims.IDENTIFIER);
        builder.RequireClaim(JwtClaims.NAME);
    }
}