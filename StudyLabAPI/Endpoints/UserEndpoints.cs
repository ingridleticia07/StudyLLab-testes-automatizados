using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Middlewares.Auth;
using StudyLabAPI.Models;
using StudyLabAPI.Summaries;

namespace StudyLabAPI.Endpoints;

public static class UserEndpoints
{
    public static RouteGroupBuilder MapUserEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapGet("profile", GetUserProfileInfo)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE)
            .WithOpenApi(UserSummaries.UserProfileInfoSpecification);
        
        return builder;
    }
    
    private static async Task<IResult> GetUserProfileInfo(HttpContext context,
        [FromServices] IUsuarioController controller)
    {
        int userId = int.Parse(context.User.Claims.First(claim => claim.Type == ClaimTypes.Name).Value);
        
        UserReadModel? result;
        try
        {
            result = await controller.GetUserInfoById(userId);
        }
        catch(UsuarioNotFoundException e)
        {
            return Results.NotFound(e.Message);
        }
        catch(Exception e)
        {
            return Results.BadRequest(e.Message);
        }
        
        return Results.Ok(result);
    }
}