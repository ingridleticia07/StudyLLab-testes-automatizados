using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Middlewares.Auth;
using StudyLabAPI.Models;
using StudyLabAPI.Models.User.DTOs;
using StudyLabAPI.Services.Application.User;
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

        #region Admin permision
        builder.MapGet("/", GetUsers)
            .WithOpenApi(UserSummaries.AdminGetUsersSpecificatiom)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_ADMIN_ROLE);
        builder.MapPut("/{id:int}", PutUpdateUser)
            .WithOpenApi(UserSummaries.AdminPutUpdateUserSpecification)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_ADMIN_ROLE);
        builder.MapDelete("/{id:int}", DeleteUser)
            .WithOpenApi(UserSummaries.AdminDeleteUserSpecefication)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_ADMIN_ROLE);
        #endregion
        
        builder.MapGet("profile", GetUserProfileInfo)
            .WithOpenApi(UserSummaries.GetUserProfileInfoSpecification)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE);
        
        return builder;
    }

    #region Admin permision
    /// <summary>
    /// Trata requisição de <c>/user/</c>
    /// </summary>
    /// <param name="context">Contexto da requisição para pegar as informações de autenticação do usuário.</param>
    /// /// <param name="page">Número da pagina</param>
    /// <param name="pageSize">Tamanho de cada pagina</param>
    /// <param name="service">Controlador que irá gerenciar as necessidades da requisição.</param>
    /// <returns>Resposta da requisição.</returns>
    /// <permission cref="AuthorizationPolicies">Requisições devem estar autenticadas.
    /// Política: <see cref="AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_ADMIN_ROLE"/></permission>
    [ProducesResponseType(typeof(UsersListResponse), 200)]
    private async static Task<IResult> GetUsers(HttpContext context,
        [FromQuery] int page,
        [FromQuery] int pageSize,
        [FromQuery] int status,
        [FromQuery] int userType,
        [FromServices] IUsuarioService service,
        [FromQuery] bool onlyProfessor = false)
    {
        UsersListResponse result;
        try
        {
            result = await service.GetUsers(page, pageSize,userType,status, onlyProfessor);
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.Message);
        }

        return Results.Ok(result);
    }
    /// <summary>
    /// Trata requisição PUT de <c>/user/</c>
    /// </summary>
    /// <param name="context">Contexto da requisição para pegar as informações de autenticação do usuário.</param>
    /// <param name="id">ID do usuário</param>
    /// <param name="request">Informações que serão atualizadas do usuário, com os novos valores</param>
    /// <param name="service">Controlador que irá gerenciar as necessidades da requisição.</param>
    /// <returns>Resposta da requisição</returns>
    [ProducesResponseType(typeof(UserReadModel), 200)]
    private async static Task<IResult> PutUpdateUser(HttpContext context,
        [FromRoute] int id,
        [FromBody] UpdateUserRequestModel request,
        [FromServices] IUsuarioService service)
    {
        UserReadModel updatedUser;

        try
        {
            updatedUser = await service.UpdateUserById(id, request);
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
    /// Trata requisição de <c>/user/:id</c>
    /// </summary>
    /// <param name="context">Contexto da requisição para pegar as informações de autenticação do usuário.</param>
    /// <param name="id">ID do usuário</param>
    /// <param name="service">Controlador que irá gerenciar as necessidades da requisição.</param>
    /// <returns>Resposta da requisição.</returns>
    /// <permission cref="AuthorizationPolicies">Requisições devem estar autenticadas.
    /// Política: <see cref="AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_ADMIN_ROLE"/></permission>
    [ProducesResponseType(typeof(int), 200)]
    private async static Task<IResult> DeleteUser(HttpContext context,
        [FromRoute] int id,
        [FromServices] IUsuarioService service)
    {
        int deletedId;

        try
        {
            deletedId = await service.DeleteUser(id);
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
    #endregion

    /// <summary>
    /// Trata requisição de <c>/user/profile</c>
    /// </summary>
    /// <param name="context">Contexto da requisição para pegar as informações de autenticação do usuário.</param>
    /// <param name="service">Controlador que irá gerenciar as necessidades da requisição.</param>
    /// <returns>Resposta da requisição.</returns>
    /// <permission cref="AuthorizationPolicies">Requisições devem estar autenticadas.
    /// Política: <see cref="AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE"/></permission>
    [ProducesResponseType(typeof(UserReadModel), 200)]
    private async static Task<IResult> GetUserProfileInfo(HttpContext context,
        [FromServices] IUsuarioService service,
        [FromQuery] int idUsuario = 0)
    {
        int userId = 0;

        if (idUsuario!=0)
            userId = idUsuario;
        else
            userId = int.Parse(context.User.Claims.First(claim => claim.Type == ClaimTypes.Name).Value);
        
        UserReadModel? result;
        try
        {
            result = await service.GetUserInfoById(userId);
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