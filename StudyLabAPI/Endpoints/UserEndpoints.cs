using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Middlewares.Cache;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Enum;
using StudyLabAPI.Summaries;

namespace StudyLabAPI.Endpoints;

public static class UserEndpoints
{
    public static RouteGroupBuilder MapUserEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapGet("id/{id:int}", UserGetByIdEndpoint)
            .WithOpenApi(UserSummaries.UserGetByIdSpecification);
        
        return builder;
    }

    private static IResult UserGetByIdEndpoint(HttpContext context,
        [FromRoute] int id)
    {
        try
        {
            //Controller
        }
        catch(Exception)
        {
            return Results.BadRequest(); 
        }
        
        return Results.Ok(new UserReadModel
        {
            email = "test@gmail.com",
            username = 1.ToString(),
            active = true,
            role = 0,
            cursoCode = CursoCode.ES
        });
    }
}