using StudyLabAPI.Summaries;
using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Models;


namespace StudyLabAPI.Endpoints;
public static class DisciplinaEndpoints
{
    public static RouteGroupBuilder MapDisciplinaEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapGet("listar", GetDisciplinas)
            .WithOpenApi(AuthSummaries.AuthRegisterSpecification);

        return builder;
    }
    private static async Task<IResult> GetDisciplinas(HttpContext context,
        [FromServices] IDisciplinaController controller)
    {

        List<DisciplinaReadModel>? result;
        try
        {
            result = await controller.GetAllDisciplina();
        }
        catch (UsuarioNotFoundException e)
        {
            return Results.NotFound(e.Message);
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.Message);
        }

        return Results.Ok(result);
    }
}
