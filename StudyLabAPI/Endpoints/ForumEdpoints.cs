using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Models;
using StudyLabAPI.Summaries;

namespace StudyLabAPI.Endpoints
{
    public static class ForumEdpoints
    {
        public static RouteGroupBuilder MapForumEndpoints(this RouteGroupBuilder builder)
        {
            builder.MapGet("listarTopicosDiscussao", GetAllTopicosDiscussao)
                .WithOpenApi(ForumSummaries.ForumGetAllTopicosDiscussao);
            builder.MapGet("listarTopicosDiscussaoByDisciplina", GetAllTopicosDiscussaoByDisciplina)
                .WithOpenApi(ForumSummaries.ForumGetAllTopicosDiscussao);
            builder.MapGet("listarTopicosDiscussaoWithPagination", GetTopicosDiscussaoLimitedByPageAndPageSize)
                .WithOpenApi(ForumSummaries.ForumGetAllTopicosDiscussao);
            builder.MapGet("listarRespostasForumByDisciplinaOrTopico", GetRespostaForumByDisciplinaOrTopico);
            builder.MapPost("criarTopicoDiscussao", CreateTopicoDiscussao)
                .WithOpenApi(ForumSummaries.ForumCreateTopicoDiscussao);
            builder.MapPut("editarTopicoDiscussao", UpdateTopicoDiscussao)
                .WithOpenApi(ForumSummaries.ForumUpdateTopicoDiscussao);
            builder.MapDelete("deletarTopicoDiscussao", DeleteTopicoDiscussao)
                .WithOpenApi(ForumSummaries.ForumDeleteTopicoDiscussao);
            builder.MapGet("ListarRespostasForum", GetAllRespostasForum)
                .WithOpenApi(ForumSummaries.ForumGetAllRespostaForum);
            builder.MapPost("cadastrarRespostaForum", CreateRespostaForum)
                .WithOpenApi(ForumSummaries.ForumCreateRespostaForum);
            builder.MapPut("AtualizarRespostaForum", UpdateRespostaForum)
                .WithOpenApi(ForumSummaries.ForumUpdateRespostaForum);
            builder.MapDelete("DeletarRespostaForum", DeleteRespostaForum)
                .WithOpenApi(ForumSummaries.ForumDeleteRespostaForum);
            builder.MapPost("CadastrarForum", CreateForum)
                .WithOpenApi(ForumSummaries.ForumCreateForum);
            builder.MapPut("AtualizarForum", UpdateForum)
                .WithOpenApi(ForumSummaries.ForumUpdateForum);
            builder.MapGet("ListarForums", GetForums)
                .WithOpenApi(ForumSummaries.ForumGetForums);
            builder.MapDelete("ApagarForum", DeleteForum)
                .WithOpenApi(ForumSummaries.ForumDeleteForum);
            builder.MapGet("ListarForumsPeloTopico", GetForumByTopico)
                .WithOpenApi(ForumSummaries.ForumGetForumByTopico);

            return builder;
        }

        [ProducesResponseType(typeof(List<RespostaForumModel>), 200)]
        private static async Task<IResult> GetRespostaForumByDisciplinaOrTopico(HttpContext context,
            [FromQuery] int page,
            [FromQuery] int pageSize,
            [FromQuery] int idDisciplina,
            [FromQuery] int idTopico,
            [FromServices] IForumController controller)
        {

            RespostaForumListResponse? result;
            try
            {
                result = await controller.GetAllRespostasForumByDisciplinaOrTopico(page, pageSize,idDisciplina,idTopico);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(result);
        }

        [ProducesResponseType(typeof(List<TopicoDiscussaoModel>), 200)]
        private static async Task<IResult> GetTopicosDiscussaoLimitedByPageAndPageSize(HttpContext context,
            [FromQuery] int page,
            [FromQuery] int pageSize,
            [FromServices] IForumController controller)
        {

            TopicoDiscussaoListResponse? result;
            try
            {
                result = await controller.GetTopicosDiscussaoLimitedByPageAndPageSize(page,pageSize);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(result);
        }

        [ProducesResponseType(typeof(List<TopicoDiscussaoModel>), 200)]
        private static async Task<IResult> GetAllTopicosDiscussao(HttpContext context,
            [FromServices] IForumController controller)
        {

            List<TopicoDiscussaoModel>? result;
            try
            {
                result = await controller.GetAllTopicosDiscussao();
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(result);
        }

        [ProducesResponseType(typeof(List<TopicoDiscussaoModel>), 200)]
        private static async Task<IResult> GetAllTopicosDiscussaoByDisciplina(HttpContext context,
            [FromQuery] int idDisciplina,
            [FromServices] IForumController controller)
        {

            List<TopicoDiscussaoModel>? result;
            try
            {
                result = await controller.GetAllTopicosDiscussaoByDisciplina(idDisciplina);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(result);
        }

        [ProducesResponseType(typeof(RegisteredTopicoDiscussaoRequestModel), 200)]
        private static async Task<IResult> CreateTopicoDiscussao(HttpContext context,
            [FromBody] RegisteredTopicoDiscussaoRequestModel novoTopico,
            [FromServices] IForumController controller)
        {
            var checkIfTopicoDiscussaoExists = await controller.VerifyTopicoDiscussaoExists(novoTopico);

            if(checkIfTopicoDiscussaoExists == false)
            {
                try
                {
                    await controller.CreateTopicoDiscussao(novoTopico);
                }
                catch (Exception e)
                {
                    return Results.BadRequest(e.Message);
                }
            }
            else
            {
                return Results.Content("Tópico discussão existente", 
                    statusCode: StatusCodes.Status409Conflict);
            }
            return Results.Ok(novoTopico);
        }
        
        [ProducesResponseType(typeof(RegisteredTopicoDiscussaoRequestModel), 200)]
        private static async Task<IResult> UpdateTopicoDiscussao(HttpContext context,
        [FromBody] RegisteredTopicoDiscussaoRequestModel topicoDiscussaoUpdate,
        [FromServices] IForumController controller)
        {
            var checkIfTopicoDiscussaoExists = await controller.VerifyTopicoDiscussaoExistsWithId(topicoDiscussaoUpdate);

            if (checkIfTopicoDiscussaoExists == false)
            {
                try
                {
                    await controller.UpdateTopicoDiscussao(topicoDiscussaoUpdate);
                }
                catch (Exception e)
                {
                    return Results.BadRequest(e.Message);
                }
            }
            else
            {
                return Results.Content("Tópico discussão existente", 
                    statusCode: StatusCodes.Status409Conflict);
            }


            return Results.Ok(topicoDiscussaoUpdate);
        }
        
        [ProducesResponseType(typeof(TopicoDiscussaoModel), 200)]
        private static async Task<IResult> DeleteTopicoDiscussao(HttpContext context,
        [FromQuery] int idTopicoDiscussao,
        [FromServices] IForumController controller)
        {

            try
            {
                await controller.DeleteTopicoDiscussao(idTopicoDiscussao);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(idTopicoDiscussao);
        }
        
        [ProducesResponseType(typeof(List<RespostaForumModel>), 200)]
        private static async Task<IResult> GetAllRespostasForum(HttpContext context,
        [FromServices] IForumController controller)
        {
            List<RespostaForumModel>? result;
            try
            {
                result = await controller.GetAllRespostasForum();
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(result);
        }
        
        [ProducesResponseType(typeof(RegisteredRespostaForumModel), 200)]
        private static async Task<IResult> CreateRespostaForum(HttpContext context,
            [FromBody] RegisteredRespostaForumModel newRespostaForum,
            [FromServices] IForumController controller)
        {
            bool checkIfRespostaForum = await controller.VerifyRespostaForumExists(newRespostaForum);

            if (checkIfRespostaForum == false)
            {
                try
                {
                    await controller.CreateRespostaForum(newRespostaForum);
                }
                catch (Exception e)
                {
                    return Results.BadRequest(e.Message);
                }
            }
            else
            {
                return Results.Content("Reposta do fórum já existe", 
                    statusCode: StatusCodes.Status409Conflict);
            }
            return Results.Ok(newRespostaForum);
        }
        
        [ProducesResponseType(typeof(RegisteredRespostaForumModel), 200)]
        private static async Task<IResult> UpdateRespostaForum(HttpContext context,
        [FromBody] RegisteredRespostaForumModel newRespostaForum,
        [FromServices] IForumController controller)
        {
            var checkIfRespostaForumExists = await controller.VerifyRespostaForumExistsWithId(newRespostaForum);

            if (checkIfRespostaForumExists == false)
            {
                try
                {
                    await controller.UpdateRespostaForum(newRespostaForum);
                }
                catch (Exception e)
                {
                    return Results.BadRequest(e.Message);
                }
            }
            else
            {
                return Results.Ok("Resposta Forum existente");
            }


            return Results.Ok(newRespostaForum);
        }
        
        [ProducesResponseType(typeof(RespostaForumModel), 200)]
        private static async Task<IResult> DeleteRespostaForum(HttpContext context,
        [FromBody] RespostaForumModel respostaForumModel,
        [FromServices] IForumController controller)
        {
            try
            {
                await controller.DeleteRespostaForum(respostaForumModel);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(respostaForumModel);
        }
        
        [ProducesResponseType(typeof(ResgisteredForumModel), 200)]
        private static async Task<IResult> CreateForum(HttpContext context,
            [FromBody] ResgisteredForumModel novoForum,
            [FromServices] IForumController controller)
        {
            var checkIfForumExists = await controller.VerifyForumCreated(novoForum);
            if(checkIfForumExists == false)
            {
                try
                {
                    await controller.CreateForum(novoForum);
                }
                catch (Exception e)
                {
                    return Results.BadRequest(e.Message);
                }
                return Results.Ok(novoForum);
            }
            else
            {
                return Results.Ok("Esse forum já existe!");
            }
        }
        
        [ProducesResponseType(typeof(ResgisteredForumModel), 200)]
        private static async Task<IResult> UpdateForum(HttpContext context,
        [FromBody] ResgisteredForumModel forumForUpdate,
        [FromServices] IForumController controller)
        {
            var checkIfForumExists = await controller.VerifyForumCreatedWithId(forumForUpdate);
            if (checkIfForumExists == false)
            {
                try
                {
                    await controller.UpdateForum(forumForUpdate);
                }
                catch (Exception e)
                {
                    return Results.BadRequest(e.Message);
                }

                return Results.Ok(forumForUpdate);
            }
            else
            {
                return Results.Ok("Esse forum já existe!");
            }
        }
        
        [ProducesResponseType(typeof(List<ForumModel>), 200)]
        private static async Task<IResult> GetForums(HttpContext context,
        [FromServices] IForumController controller)
        {

            List<ForumModel>? result;
            try
            {
                result = await controller.GetAllForums();
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(result);
        }
        
        [ProducesResponseType(typeof(ForumModel), 200)]
        private static async Task<IResult> DeleteForum(HttpContext context,
        [FromBody] ForumModel forumModel,
        [FromServices] IForumController controller)
        {
            try
            {
                await controller.DeleteForum(forumModel);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(forumModel);
        }
        
        [ProducesResponseType(typeof(List<ForumModel>), 200)]
        private static async Task<IResult> GetForumByTopico(HttpContext context,
        [FromBody] RegisteredTopicoDiscussaoRequestModel topico,
        [FromServices] IForumController controller)
        {

            List<ForumModel>? result;
            try
            {
                result = await controller.GetForumByTopico(topico);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(result);
        }
    }
}
