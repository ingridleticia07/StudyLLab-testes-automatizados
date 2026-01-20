using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Middlewares.Auth;
using StudyLabAPI.Services.Application.Utils;
using StudyLabAPI.Summaries;

namespace StudyLabAPI.Endpoints;

public static class UtilsEndpoints
{
    public static IEndpointRouteBuilder MapUtilsEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("health", CheckHealth)
            .WithOpenApi(UtilsSummaries.CheckHealthSpecifications);
        endpoints.MapGet("authenticated", CheckAuthState)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE)
            .WithOpenApi(UtilsSummaries.CheckAuthStateSpecifications);

        return endpoints;
    }
    private static IResult CheckAuthState(HttpContext context,
        [FromServices] IUtilsService service)
    {
        string? userIdFromClaims = context.User.Claims
            .FirstOrDefault(claim => claim.Type == ClaimTypes.Name)?.Value;
        bool isValid = service.ValidateAuthState(userIdFromClaims);
        
        return isValid ? Results.Ok() : Results.Unauthorized();
    }
    private static IResult CheckHealth(HttpContext context) => Results.Ok("OK");
}