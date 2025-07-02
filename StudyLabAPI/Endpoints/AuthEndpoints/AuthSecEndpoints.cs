using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Middlewares.Auth;
using StudyLabAPI.Models;
using StudyLabAPI.Summaries;

namespace StudyLabAPI.Endpoints.AuthEndpoints;

public static class AuthSecEndpoints
{
    /// <summary>
    /// Mapeia os endpoints de autenticação.
    /// </summary>
    /// <param name="builder">Grupo de endpoints de autenticação <c>/auth</c>.</param>
    public static RouteGroupBuilder MapAuthSecEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPut("confirmEmail", AuthConfirmEmailHandler)
            .WithOpenApi(AuthSummaries.AuthConfirmEmailSpecification);
        builder.MapPost("resendConfirmationEmail", AuthResendConfirmationEmail)
            .WithOpenApi(AuthSummaries.AuthResendConfirmationEmailSpecification);
        
        return builder;
    }

    #region ConfirmEmail
    
    /// <summary>
    /// Trata da requisição de <c>/auth/confirmEmail</c>
    /// </summary>
    /// <param name="context">Usado para pegar o ID do usuário nos Claims da requisição</param>
    /// <param name="confirmUserEmailRequestModel">Informações para confirmação do email,
    /// vindas do corpo da requisição</param>
    /// <param name="controller">Controlador que irá gerenciar as nescessidades da requisição</param>
    /// <returns>Resposta da requisição</returns>
    /// <permission cref="AuthorizationPolicies">Permitido apenas usuários e administradores autenticados</permission>
    [ProducesResponseType(typeof(CodigoUsuarioReadModel), 200)]
    async private static Task<IResult> AuthConfirmEmailHandler(
        HttpContext context,
        [FromBody] ConfirmUserEmailRequestModel confirmUserEmailRequestModel,
        [FromServices] IAuthController controller,
        [FromQuery] int idUser = 0)
    {
        int userId = 0;

        if (idUser != 0)
            userId = idUser;
        else
            userId = int.Parse(context.User.Claims
            .First(c => c.Type == ClaimTypes.Name).Value);
        
        CodigoUsuarioReadModel codigoUsuarioReadModel;
        try
        {
            codigoUsuarioReadModel = await controller.ConfirmUserEmail(confirmUserEmailRequestModel, userId);
        }
        catch (Exception e) when (e is UsuarioNotFoundException or ConfirmationCodeNotFoundException)
        {
            return Results.NotFound(e.Message);
        }
        catch(Exception e)
        {
            return Results.BadRequest(e.Message);
        }

        return Results.Ok(codigoUsuarioReadModel);
    }
    /// <summary>
    /// Trata da requisição de <c>/auth/resendConfirmationEmail</c>
    /// </summary>
    /// <param name="context">Usado para pegar o ID do usuário nos Claims da requisição</param>
    /// <param name="controller">Controlador que irá gerenciar as nescessidades da requisição</param>
    /// <returns>Resposta da requisição</returns>
    /// <permission cref="AuthorizationPolicies">Permitido apenas usuários e administradores autenticados</permission>
    async private static Task<IResult> AuthResendConfirmationEmail(
        HttpContext context,
        [FromQuery] int? userId, 
        [FromServices] IAuthController controller)
    {
        int userIdentifier = 0;

        if (userId != 0)
            userIdentifier = (int)userId;
        else
            userIdentifier = int.Parse(context.User.Claims
            .First(c => c.Type == ClaimTypes.Name).Value);
        
        bool sended;
        try
        {
            await controller.ResendVerificationCode(userIdentifier);
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.Message);
        }
        
        return Results.Ok();
    }
    
    #endregion
    
}