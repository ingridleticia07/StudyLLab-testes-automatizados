using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Models;
using StudyLabAPI.Summaries;

namespace StudyLabAPI.Endpoints
{
    public static class ForumEdpoints
    {
        public static RouteGroupBuilder MapForumEndpoints(this RouteGroupBuilder builder)
        {
            builder.MapGet("listarTopicosDiscussao", GetAllTopicosDiscussao);
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
    }
}
