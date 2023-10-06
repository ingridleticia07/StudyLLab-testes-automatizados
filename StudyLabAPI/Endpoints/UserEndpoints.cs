using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Middlewares.Cache;
using StudyLabAPI.Models;
using StudyLabAPI.Summaries;

namespace StudyLabAPI.Endpoints;

public static class UserEndpoints
{
    public static RouteGroupBuilder MapUserEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapGet("id/{id:int}", UserGetByIdEndpoint)
            .AllowAnonymous()
            .CacheOutput(OutputCachePolicy.USER_GET_USER_BY_ID_POLICY)
            .WithOpenApi(UserSummaries.UserGetByIdSpecification);
        
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
}