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
        builder.MapGet("listarDisciplina/{IdDisciplina}", GetDisciplina)
            .WithOpenApi(AuthSummaries.AuthRegisterSpecification);
        builder.MapPost("cadastrarDisciplina", CreateDisciplina)
            .WithOpenApi(AuthSummaries.AuthRegisterSpecification);
        builder.MapPut("editarDisciplina", UpdateDisciplina)
            .WithOpenApi(AuthSummaries.AuthRegisterSpecification);
        builder.MapDelete("excluirDisciplina", DeleteDisciplina)
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
    private static async Task<IResult> GetDisciplina(HttpContext context,
            [FromRoute(Name = "IdDisciplina")] int Iddisciplina,
            [FromServices] IDisciplinaController controller)
    {
        DisciplinaReadModel? result;
        try
        {
            result = await controller.GetDisciplinaById(Iddisciplina);
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
    private static async Task<IResult> CreateDisciplina(HttpContext context,
        [FromBody] RegisterDisciplinaRequestModel novaDisciplina,
        [FromServices] IDisciplinaController controller)
    {
        var checkIfObjectExists = await controller.VerifyDisciplinaCreated(novaDisciplina);

        if(checkIfObjectExists == false)
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
        }
        else
        {
            return Results.Ok("Disciplina existente");
        }

        return Results.Ok(novaDisciplina);
    }

    private static async Task<IResult> UpdateDisciplina(HttpContext context,
        [FromBody] RegisterDisciplinaRequestModel novaDisciplina,
        [FromServices] IDisciplinaController controller)
    {
        var checkIfObjectStillExists = await controller.VerifyDisciplinaCreatedWithId(novaDisciplina);

        if(checkIfObjectStillExists == false)
        {
            try
            {
                await controller.UpdateDisciplina(novaDisciplina);
            }
            catch (UsuarioNotFoundException e)
            {
                return Results.NotFound(e.Message);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }
        }
        else{
            return Results.Ok("Disciplina existente");
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
