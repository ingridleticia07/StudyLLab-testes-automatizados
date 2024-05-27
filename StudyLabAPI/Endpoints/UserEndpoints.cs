using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Middlewares.Auth;
using StudyLabAPI.Models;
using StudyLabAPI.Summaries;

namespace StudyLabAPI.Endpoints;

public static class UserEndpoints
{
    /// <summary>
    /// Mapeia os endpoints de usuário.
    /// </summary>
    /// <param name="builder">Grupo de endpoints de autenticação <c>/user</c>.</param>
    /// <returns></returns>
    public static RouteGroupBuilder MapUserEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapGet("/", GetUsers)
            .WithOpenApi(UserSummaries.GetUsersSpecificatiom)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_ADMIN_ROLE);
        builder.MapPut("/{id:int}", PutUpdateUser)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_ADMIN_ROLE);
        builder.MapDelete("/{id:int}", DeleteUser)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_ADMIN_ROLE);
        
        builder.MapGet("profile", GetUserProfileInfo)
            .WithOpenApi(UserSummaries.UserProfileInfoSpecification)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE);
        
        return builder;
    }

    private async static Task<IResult> DeleteUser(HttpContext context,
        [FromRoute] int id,
        [FromServices] IUsuarioController controller)
    {
        int deletedId;

        try
        {
            deletedId = await controller.DeleteUser(id);
        }
        catch (ValidationException e)
        {
            return Results.BadRequest(e.Message);
        }
        catch (UsuarioNotFoundException e)
        {
            return Results.NotFound(e.Message);
        }
        
        return Results.Ok(deletedId);
    }

    /// <summary>
    /// Trata requisição de <c>/user/</c>
    /// </summary>
    /// <param name="context">Contexto da requisição para pegar as informações de autenticação do usuário.</param>
    /// /// <param name="page">Número da pagina</param>
    /// <param name="pageSize">Tamanho de cada pagina</param>
    /// <param name="controller">Controlador que irá gerenciar as necessidades da requisição.</param>
    /// <returns>Resposta da requisição.</returns>
    /// <permission cref="AuthorizationPolicies">Requisições devem estar autenticadas.
    /// Política: <see cref="AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_ADMIN_ROLE"/></permission>
    [ProducesResponseType(typeof(ICollection<UserReadModel>), 200)]
    private async static Task<IResult> GetUsers(HttpContext context,
        [FromQuery] int page,
        [FromQuery] int pageSize,
        [FromServices] IUsuarioController controller)
    {
        IReadOnlyList<UserReadModel> result;

        try
        {
            result = await controller.GetUsers(page, pageSize);
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.Message);
        }

        return Results.Ok(result);
    }
    
    private async static Task<IResult> PutUpdateUser(HttpContext context,
        [FromRoute] int id,
        [FromBody] UpdateUserRequestModel request,
        [FromServices] IUsuarioController controller)
    {
        UserReadModel updatedUser;

        try
        {
            updatedUser = await controller.UpdateUser(id, request);
        }
        catch (ValidationException e)
        {
            return Results.BadRequest(e.Message);
        }
        catch (Exception e) when (e is CursoNotFoundException or UsuarioNotFoundException)
        {
            return Results.NotFound(e.Message);
        }

        return Results.Ok(updatedUser);
    }

    /// <summary>
    /// Trata requisição de <c>/user/profile</c>
    /// </summary>
    /// <param name="context">Contexto da requisição para pegar as informações de autenticação do usuário.</param>
    /// <param name="controller">Controlador que irá gerenciar as necessidades da requisição.</param>
    /// <returns>Resposta da requisição.</returns>
    /// <permission cref="AuthorizationPolicies">Requisições devem estar autenticadas.
    /// Política: <see cref="AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE"/></permission>
    [ProducesResponseType(typeof(UserReadModel), 200)]
    private async static Task<IResult> GetUserProfileInfo(HttpContext context,
        [FromServices] IUsuarioController controller)
    {
        int userId = int.Parse(context.User.Claims.First(claim => claim.Type == ClaimTypes.Name).Value);
        
        UserReadModel? result;
        try
        {
            result = await controller.GetUserInfoById(userId);
        }
        catch(UsuarioNotFoundException e)
        {
            return Results.NotFound(e.Message);
        }
        catch(Exception e)
        {
            return Results.BadRequest(e.Message);
        }
        
        return Results.Ok(result);
    }
}