using StudyLabAPI.Summaries;
using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Models;

namespace StudyLabAPI.Endpoints;
public static class DisciplinaEndpoints
{
    public static RouteGroupBuilder MapDisciplinaEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapGet("listarDisciplinas", GetDisciplinas)
            .WithOpenApi(DisciplinaSummaries.DisciplinaGetDisciplinas);
        builder.MapGet("listarDisciplina/{idDisciplina:int}", GetDisciplina)
            .WithOpenApi(DisciplinaSummaries.DisciplinaGetDisciplina);
        builder.MapPost("cadastrarDisciplina", CreateDisciplina)
            .WithOpenApi(DisciplinaSummaries.DisciplinaCreateDisciplina);
        builder.MapPut("editarDisciplina", UpdateDisciplina)
            .WithOpenApi(DisciplinaSummaries.DisciplinaUpdateDisciplina);
        builder.MapDelete("excluirDisciplina", DeleteDisciplina)
            .WithOpenApi(DisciplinaSummaries.DisciplinaDeleteDisciplina);

        return builder;
    }
    
    [ProducesResponseType(typeof(List<DisciplinaReadModel>), 200)]
    private static async Task<IResult> GetDisciplinas(HttpContext context,
        [FromServices] IDisciplinaController controller)
    {

        List<DisciplinaReadModel>? result;
        try
        {
            result = await controller.GetAllDisciplinas();
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.Message);
        }

        return Results.Ok(result);
    }
    
    [ProducesResponseType(typeof(DisciplinaReadModel), 200)]
    private static async Task<IResult> GetDisciplina(HttpContext context,
            [FromRoute(Name = "IdDisciplina")] int idDisciplina,
            [FromServices] IDisciplinaController controller)
    {
        DisciplinaReadModel? result;
        try
        {
            bool disciplinaExists = await controller.VerifyDisciplinaCreatedWithId(idDisciplina);

            if(disciplinaExists == true)
                result = await controller.GetDisciplinaById(idDisciplina);
            else
                return Results.Content("Disciplina inexistente",
                statusCode: StatusCodes.Status409Conflict);
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.Message);
        }

        return Results.Ok(result);
    }
    
    [ProducesResponseType(typeof(RegisterDisciplinaRequestModel), 200)]
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
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }
        }
        else
        {
            return Results.Content("Disciplina existente", 
                statusCode: StatusCodes.Status409Conflict);
        }

        return Results.Ok(novaDisciplina);
    }
    
    [ProducesResponseType(typeof(RegisterDisciplinaRequestModel), 200)]
    private static async Task<IResult> UpdateDisciplina(HttpContext context,
        [FromBody] RegisterDisciplinaRequestModel novaDisciplina,
        [FromServices] IDisciplinaController controller)
    {
        bool checkIfObjectStillExists = await controller.VerifyDisciplinaCreatedWithId(novaDisciplina.idDisciplina);

        if(checkIfObjectStillExists == false)
        {
            try
            {
                await controller.UpdateDisciplina(novaDisciplina);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }
        }
        else{
            return Results.Content("Disciplina existente", 
                statusCode: StatusCodes.Status409Conflict);
        }

        return Results.Ok(novaDisciplina);
    }
    
    [ProducesResponseType(typeof(DisciplinaModel), 200)]
    private static async Task<IResult> DeleteDisciplina(HttpContext context,
        [FromBody] int disciplinaIdentifier, //TODO: Precissa do modelo inteiro para deletar?
        [FromServices] IDisciplinaController controller)
    {
        try
        {
            await controller.DeleteDisciplina(disciplinaIdentifier);
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.Message);
        }

        return Results.Ok(disciplinaIdentifier);
    }
}
