using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Middlewares.Auth;
using StudyLabAPI.Models;
using StudyLabAPI.Summaries;

namespace StudyLabAPI.Endpoints
{
    public static class MaterialEndpoints
    {
        public static RouteGroupBuilder MapMaterialEndpoints(this RouteGroupBuilder builder)
        {
            builder.MapPost("cadastrarDocumento", CreateDocumento)
                .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE)
                .WithOpenApi(MaterialSummaries.CreateDocumento);
            builder.MapPost("cadastrarDenuncia", CreateDenuncia)
                .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE)
                .WithOpenApi(MaterialSummaries.CreateDocumento);
            builder.MapPut("UpdateDenuncia", UpdateDenunciaStatus)
                .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE)
                .WithOpenApi(MaterialSummaries.CreateDocumento);
            builder.MapGet("ListarDocumentosWithPagination", ListarDocumentosWithPagination)
                .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE)
                .WithOpenApi(MaterialSummaries.CreateDocumento);
            builder.MapGet("ListarDenunciasWithPagination", ListarDenunciasWithPagination)
                .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE)
                .WithOpenApi(MaterialSummaries.CreateDocumento);
            builder.MapDelete("DeleteDocumento", DeleteDocumento)
                .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE)
                .WithOpenApi(MaterialSummaries.CreateDocumento);
            return builder;
        }

        private static async Task<IResult> CreateDocumento(HttpContext context,
        [FromForm] RegisteredDocumentoModel novoDocumento,
        [FromForm] IFormFileCollection file,
        [FromServices] IDocumentoController controller)
        {
            try
            {
                await controller.CreateDocumento(novoDocumento, file.ToList());
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
                return Results.BadRequest(e);
            }

            return Results.Ok(result);
        }

        private static async Task<IResult> ListarDenunciasWithPagination(HttpContext context,
            [FromQuery] int page,
            [FromQuery] int pageSize,
            [FromServices] IDocumentoController controller)
        {

            DenunciaListResponse? result;
            try
            {
                result = await controller.GetAllDenuncias(page, pageSize);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e);
            }

            return Results.Ok(result);
        }

        private static async Task<IResult> DeleteDocumento(HttpContext context,
        [FromQuery] int idDocumento,int idUsuario,
        [FromServices] IDocumentoController controller)
        {
            try
            {
                await controller.DeleteDocumento(idDocumento, idUsuario);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(idDocumento);
        }

        private static async Task<IResult> CreateDenuncia(HttpContext context,
        [FromBody] RegisteredDocumentoModel documento,
        [FromServices] IDocumentoController controller)
        {
            try
            {
                await controller.CreateDenuncia(documento.idDocumento, documento.IdUsuario, documento.descricao);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(documento.idDocumento);
        }

        private static async Task<IResult> UpdateDenunciaStatus(HttpContext context,
        [FromBody] DenunciaReadModel denunciaReadModel,
        [FromServices] IDocumentoController controller)
        {
            try
            {
                await controller.UpdateDenunciaStatus(denunciaReadModel);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(denunciaReadModel);
        }
    }
}
