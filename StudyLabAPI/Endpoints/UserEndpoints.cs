using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Enum;
using StudyLabAPI.Summaries;

namespace StudyLabAPI.Endpoints;

public static class UserEndpoints
{
    public static RouteGroupBuilder MapUserEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapGet("users/id", UserGetByIdEndpoint)
            .WithOpenApi(UserSummaries.UserGetByIdSpecification);
        
        return builder;
    }

    private static IResult UserGetByIdEndpoint(HttpContext context,
        [FromQuery] int id)
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
            username = "Test",
            active = true,
            role = 0,
            cursoCode = CursoCode.ES
        });
    }
}