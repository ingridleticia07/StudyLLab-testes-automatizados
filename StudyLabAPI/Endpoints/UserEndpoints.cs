using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
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

    private static async Task<IResult> UserGetByIdEndpoint(HttpContext context,
        [FromRoute] int id,
        [FromServices] IUsuarioController controller)
    {
        UserReadModel? userReadModel;
        try
        {
            userReadModel = await controller.GetUserInfoById(id);
        }
        catch(Exception)
        {
            return Results.BadRequest(); 
        }
        
        return userReadModel is null ? Results.NotFound() : Results.Ok(userReadModel);
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
        catch(Exception)
        {
            return Results.BadRequest();
        }
        
        return result is not null ? Results.Ok(result) : Results.NotFound();
    }
}