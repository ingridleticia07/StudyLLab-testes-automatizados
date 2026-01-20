using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Forum;
using StudyLabAPI.Models.Forum.DTOs;
using StudyLabAPI.Services.Application.Forum;
using StudyLabAPI.Summaries;

namespace StudyLabAPI.Endpoints
{
    public static class ForumEndpoints
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
            [FromServices] IForumService service)
        {

            RespostaForumListResponse? result;
            try
            {
                result = await service.GetAllRespostasForumByDisciplinaOrTopico(page, pageSize,idDisciplina,idTopico);
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
            [FromQuery] int idDisciplina,
            [FromServices] IForumService service)
        {

            TopicoDiscussaoListResponse? result;
            try
            {
                result = await service.GetTopicosDiscussaoLimitedByPageAndPageSize(page,pageSize,idDisciplina);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(result);
        }

        [ProducesResponseType(typeof(List<TopicoDiscussaoModel>), 200)]
        private static async Task<IResult> GetAllTopicosDiscussao(HttpContext context,
            [FromServices] IForumService service)
        {

            List<TopicoDiscussaoModel>? result;
            try
            {
                result = await service.GetAllTopicosDiscussao();
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
            [FromServices] IForumService service)
        {

            List<TopicoDiscussaoModel>? result;
            try
            {
                result = await service.GetAllTopicosDiscussaoByDisciplina(idDisciplina);
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
            [FromServices] IForumService service)
        {
            var checkIfTopicoDiscussaoExists = await service.VerifyTopicoDiscussaoExists(novoTopico);

            if(checkIfTopicoDiscussaoExists == false)
            {
                try
                {
                    await service.CreateTopicoDiscussao(novoTopico);
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
        [FromServices] IForumService service)
        {
            var checkIfTopicoDiscussaoExists = await service.VerifyTopicoDiscussaoExistsWithId(topicoDiscussaoUpdate);

            if (checkIfTopicoDiscussaoExists == false)
            {
                try
                {
                    await service.UpdateTopicoDiscussao(topicoDiscussaoUpdate);
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
        [FromServices] IForumService service)
        {

            try
            {
                await service.DeleteTopicoDiscussao(idTopicoDiscussao);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(idTopicoDiscussao);
        }
        
        [ProducesResponseType(typeof(List<RespostaForumModel>), 200)]
        private static async Task<IResult> GetAllRespostasForum(HttpContext context,
        [FromServices] IForumService service)
        {
            List<RespostaForumModel>? result;
            try
            {
                result = await service.GetAllRespostasForum();
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
            [FromServices] IForumService service)
        {
            bool checkIfRespostaForum = await service.VerifyRespostaForumExists(newRespostaForum);

            if (checkIfRespostaForum == false)
            {
                try
                {
                    await service.CreateRespostaForum(newRespostaForum);
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
        [FromServices] IForumService service)
        {
            var checkIfRespostaForumExists = await service.VerifyRespostaForumExistsWithId(newRespostaForum);

            if (checkIfRespostaForumExists == false)
            {
                try
                {
                    await service.UpdateRespostaForum(newRespostaForum);
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
        [FromQuery] int idRespostaForum,int idUsuario,
        [FromServices] IForumService service)
        {
            try
            {
                await service.DeleteRespostaForum(idRespostaForum,idUsuario);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(idRespostaForum);
        }
        
        [ProducesResponseType(typeof(ResgisteredForumModel), 200)]
        private static async Task<IResult> CreateForum(HttpContext context,
            [FromBody] ResgisteredForumModel novoForum,
            [FromServices] IForumService service)
        {
            var checkIfForumExists = await service.VerifyForumCreated(novoForum);
            if(checkIfForumExists == false)
            {
                try
                {
                    await service.CreateForum(novoForum);
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
        [FromServices] IForumService service)
        {
            var checkIfForumExists = await service.VerifyForumCreatedWithId(forumForUpdate);
            if (checkIfForumExists == false)
            {
                try
                {
                    await service.UpdateForum(forumForUpdate);
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
        [FromServices] IForumService service)
        {

            List<ForumModel>? result;
            try
            {
                result = await service.GetAllForums();
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
        [FromServices] IForumService service)
        {
            try
            {
                await service.DeleteForum(forumModel);
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
        [FromServices] IForumService service)
        {

            List<ForumModel>? result;
            try
            {
                result = await service.GetForumByTopico(topico);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(result);
        }
    }
}
