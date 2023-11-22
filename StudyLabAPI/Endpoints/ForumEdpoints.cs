using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Models;

namespace StudyLabAPI.Endpoints
{
    public static class ForumEdpoints
    {
        public static RouteGroupBuilder MapForumEndpoints(this RouteGroupBuilder builder)
        {
            builder.MapGet("listarTopicosDiscussao", GetAllTopicosDiscussao);

            builder.MapPost("criarTopicoDiscussao", CreateTopicoDiscussao);

            builder.MapPut("editarTopicoDiscussao", UpdateTopicoDiscussao);

            builder.MapDelete("deletarTopicoDiscussao", DeleteTopicoDiscussao);

            builder.MapGet("ListarRespostasForum", GetAllRespostasForum);

            builder.MapPost("cadastrarRespostaForum", CreateRespostaForum);

            builder.MapPut("AtualizarRespostaForum", UpdateRespostaForum);

            builder.MapDelete("DeletarRespostaForum", DeleteRespostaForum);

            builder.MapPost("CadastrarForum", CreateForum);

            builder.MapPut("AtualizarForum", UpdateForum);

            builder.MapGet("ListarForums", GetForums);

            builder.MapDelete("ApagarForum", DeleteForum);
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
            var checkIfTopicoDiscussaoExists = await controller.VerifyTopicoDiscussaoExists(novoTopico);

            if(checkIfTopicoDiscussaoExists == false)
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
            }
            else
            {
                return Results.Ok("Tópico discussão existente");
            }
            return Results.Ok(novoTopico);
        }

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
                return Results.Ok("Tópico discussão existente");
            }


            return Results.Ok(topicoDiscussaoUpdate);
        }
        private static async Task<IResult> DeleteTopicoDiscussao(HttpContext context,
        [FromBody] TopicoDiscussaoModel topicoDiscussaoModel,
        [FromServices] IForumController controller)
        {

            try
            {
                await controller.DeleteTopicoDiscussao(topicoDiscussaoModel);
            }
            catch (UsuarioNotFoundException e)
            {
                return Results.NotFound(e.Message);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(topicoDiscussaoModel);
        }

        private static async Task<IResult> GetAllRespostasForum(HttpContext context,
        [FromServices] IForumController controller)
        {

            List<RespostaForumModel>? result;
            try
            {
                result = await controller.GetAllRespostasForum();
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
                return Results.Ok("Resposta forum existente");
            }
            return Results.Ok(newRespostaForum);
        }
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
                return Results.Ok("Resposta Forum existente");
            }


            return Results.Ok(newRespostaForum);
        }

        private static async Task<IResult> DeleteRespostaForum(HttpContext context,
        [FromBody] RespostaForumModel respostaForumModel,
        [FromServices] IForumController controller)
        {
            try
            {
                await controller.DeleteRespostaForum(respostaForumModel);
            }
            catch (UsuarioNotFoundException e)
            {
                return Results.NotFound(e.Message);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(respostaForumModel);
        }

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
                catch (UsuarioNotFoundException e)
                {
                    return Results.NotFound(e.Message);
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
                catch (UsuarioNotFoundException e)
                {
                    return Results.NotFound(e.Message);
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
        private static async Task<IResult> GetForums(HttpContext context,
        [FromServices] IForumController controller)
        {

            List<ForumModel>? result;
            try
            {
                result = await controller.GetAllForums();
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

        private static async Task<IResult> DeleteForum(HttpContext context,
        [FromBody] ForumModel forumModel,
        [FromServices] IForumController controller)
        {
            try
            {
                await controller.DeleteForum(forumModel);
            }
            catch (UsuarioNotFoundException e)
            {
                return Results.NotFound(e.Message);
            }
            catch (Exception e)
            {
                return Results.BadRequest(e.Message);
            }

            return Results.Ok(forumModel);
        }
    }
}
