using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Models;
using StudyLabAPI.Summaries;

namespace StudyLabAPI.Endpoints
{
    public static class MaterialEndpoints
    {
        public static RouteGroupBuilder MapMaterialEndpoints(this RouteGroupBuilder builder)
        {
            builder.MapPost("cadastrarDocumento", CreateDocumento)
                .WithOpenApi(MaterialSummaries.CreateDocumento);
            builder.MapGet("ListarDocumentosWithPagination", ListarDocumentosWithPagination)
                .WithOpenApi(MaterialSummaries.CreateDocumento);
            builder.MapDelete("DeleteDocumento", DeleteDocumento)
                .WithOpenApi(MaterialSummaries.CreateDocumento);
            return builder;
        }

        private static async Task<IResult> CreateDocumento(HttpContext context,
        [FromForm] RegisteredDocumentoModel novoDocumento,
        [FromForm] IFormFile file,
        [FromServices] IDocumentoController controller)
        {
            try
            {
                await controller.CreateDocumento(novoDocumento,file);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(novoDocumento);
        }

        private static async Task<IResult> ListarDocumentosWithPagination(HttpContext context,
            [FromQuery] int page,
            [FromQuery] int pageSize,
            [FromQuery] int idDisciplina,
            [FromQuery] int idTopico,
            [FromQuery] bool isAnyStatus,
            [FromServices] IDocumentoController controller)
        {

            DocumentoListResponse? result;
            try
            {
                result = await controller.GetAllDocumentosByDisciplinaOrTopico(page, pageSize, idDisciplina, idTopico, isAnyStatus);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(result);
        }

        private static async Task<IResult> DeleteDocumento(HttpContext context,
        [FromQuery] int idDocumento,
        [FromServices] IDocumentoController controller)
        {
            try
            {
                await controller.DeleteDocumento(idDocumento);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(idDocumento);
        }
    }
}
