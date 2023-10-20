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
        builder.MapGet("listarDisciplinas", GetDisciplinas)
            .WithOpenApi(AuthSummaries.AuthRegisterSpecification);
        builder.MapPost("cadastrarDisciplinas", CadastrarDisciplinas)
            .WithOpenApi(AuthSummaries.AuthRegisterSpecification);
        builder.MapPost("excluirDisciplina", DeleteDisciplina)
            .WithOpenApi(AuthSummaries.AuthRegisterSpecification);

        return builder;
    }
    private static async Task<IResult> GetDisciplinas(HttpContext context,
        [FromServices] IDisciplinaController controller)
    {

        List<DisciplinaReadModel>? result;
        try
        {
            result = await controller.GetAllDisciplinas();
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
    private static async Task<IResult> CadastrarDisciplinas(HttpContext context,
        [FromBody] RegisterDisciplinaRequestModel novaDisciplina,
        [FromServices] IDisciplinaController controller)
    {

        try
        {
            await controller.CreateDisciplina(novaDisciplina);
        }
        catch (UsuarioNotFoundException e)
        {
            return Results.NotFound(e.Message);
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.Message);
        }

        return Results.Ok(novaDisciplina);
    }
    private static async Task<IResult> DeleteDisciplina(HttpContext context,
        [FromBody] DisciplinaModel disciplinaModel,
        [FromServices] IDisciplinaController controller)
    {

        try
        {
            await controller.DeleteDisciplina(disciplinaModel);
        }
        catch (UsuarioNotFoundException e)
        {
            return Results.NotFound(e.Message);
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.Message);
        }

        return Results.Ok(disciplinaModel);
    }
}
