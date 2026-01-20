using StudyLabAPI.Summaries;
using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Disciplina;
using StudyLabAPI.Models.Disciplina.DTOs;
using StudyLabAPI.Services.Application.Disciplina;

namespace StudyLabAPI.Endpoints;
public static class DisciplinaEndpoints
{
    public static RouteGroupBuilder MapDisciplinaEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapGet("listarDisciplinasWithPagination", GetDisciplinas)
            .WithOpenApi(DisciplinaSummaries.DisciplinaGetDisciplinas);
        builder.MapGet("listarDisciplinas", GetAllDisciplinas);
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
    private static async Task<IResult> GetAllDisciplinas(HttpContext context,
        [FromServices] IDisciplinaService service)
    {

        List<DisciplinaModel>? result;
        try
        {
            result = await service.GetAllDisciplinas();
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.Message);
        }

        return Results.Ok(result);
    }

    [ProducesResponseType(typeof(List<DisciplinaReadModel>), 200)]
    private static async Task<IResult> GetDisciplinas(HttpContext context,
        [FromQuery] int page,
        [FromQuery] int pageSize,
        [FromQuery] int idCurso,
        [FromServices] IDisciplinaService service)
    {

        DisciplinaListResponse? result;
        try
        {
            result = await service.GetAllDisciplinasWithPagination(page,pageSize, idCurso);
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
            [FromServices] IDisciplinaService service)
    {
        DisciplinaReadModel? result;
        try
        {
            bool disciplinaExists = await service.VerifyDisciplinaCreatedWithId(idDisciplina);

            if(disciplinaExists == true)
                result = await service.GetDisciplinaById(idDisciplina);
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
        [FromServices] IDisciplinaService service)
    {
        var checkIfObjectExists = await service.VerifyDisciplinaCreated(novaDisciplina);

        if(checkIfObjectExists == false)
        {
            try
            {
                await service.CreateDisciplina(novaDisciplina);
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
        [FromServices] IDisciplinaService service)
    {
        bool checkIfDisciplinaExists = await service.VerifyDisciplinaCreated(novaDisciplina);

        if (checkIfDisciplinaExists == false)
        {
            try
            {
                await service.UpdateDisciplina(novaDisciplina);
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
        [FromQuery] int disciplinaIdentifier, //TODO: Precissa do modelo inteiro para deletar?
        [FromServices] IDisciplinaService service)
    {
        try
        {
            await service.DeleteDisciplina(disciplinaIdentifier);
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.Message);
        }

        return Results.Ok(disciplinaIdentifier);
    }
}
