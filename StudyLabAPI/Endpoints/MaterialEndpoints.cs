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
    }
}
