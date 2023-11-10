using StudyLabAPI.Summaries;
using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Models;
using StudyLabAPI.Repositories;

namespace StudyLabAPI.Endpoints
{
    public static class ForumEdpoints
    {
        public static RouteGroupBuilder MapForumEndpoints(this RouteGroupBuilder builder)
        {
            builder.MapGet("listarTopicosDiscussao", GetAllTopicosDiscussao);

            builder.MapPost("criarTopicoDiscussao", CreateTopicoDiscussao);

            builder.MapPost("editarTopicoDiscussao", UpdateTopicoDiscussao);
            //add withSummaries ao terminar

            return builder;
        }
        private static async Task<IResult> GetAllTopicosDiscussao(HttpContext context,
        [FromServices] IForumController controller)
        {

            List<TopicoDiscussaoModel>? result;
            try
            {
                result = await controller.GetAllTopicosDiscussao();
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

        private static async Task<IResult> CreateTopicoDiscussao(HttpContext context,
            [FromBody] RegisteredTopicoDiscussaoRequestModel novoTopico,
            [FromServices] IForumController controller)
        {
            try
            {
                await controller.CreateTopicoDiscussao(novoTopico);
            }
            catch (UsuarioNotFoundException e)
            {
                return Results.NotFound(e.Message);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(novoTopico);
        }

        private static async Task<IResult> UpdateTopicoDiscussao(HttpContext context,
        [FromBody] RegisteredTopicoDiscussaoRequestModel topicoDiscussaoUpdate,
        [FromServices] IForumController controller)
        {

            try
            {
                await controller.UpdateTopicoDiscussao(topicoDiscussaoUpdate);
            }
            catch (UsuarioNotFoundException e)
            {
                return Results.NotFound(e.Message);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }


            return Results.Ok(topicoDiscussaoUpdate);
        }
    }
}
