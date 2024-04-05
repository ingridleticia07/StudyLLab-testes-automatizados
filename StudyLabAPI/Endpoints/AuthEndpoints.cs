using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Middlewares.Auth;
using StudyLabAPI.Models;
using StudyLabAPI.Summaries;

namespace StudyLabAPI.Endpoints;

public static class AuthEndpoints
{
    /// <summary>
    /// Mapeia os endpoints de autenticação.
    /// </summary>
    /// <param name="builder">Grupo de endpoints de autenticação <c>/auth</c>.</param>
    public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost("register", AuthRegisterEndpointHandler)
            .WithOpenApi(AuthSummaries.AuthRegisterSpecification);
        builder.MapPost("login", AuthLoginEndpointHandler)
            .WithOpenApi(AuthSummaries.AuthLoginSpecification);
        builder.MapPut("confirmEmail", AuthConfirmEmailHandler)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE)
            .WithOpenApi(AuthSummaries.AuthConfirmEmailSpecification);
        builder.MapPost("resendConfirmationEmail", AuthResendConfirmationEmail)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE)
            .WithOpenApi(AuthSummaries.AuthResendConfirmationEmailSpecification);
        builder.MapPut("resetPassword", AuthResetPasswordHandler)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE)
            .WithOpenApi(AuthSummaries.AuthResetPasswordSpecification);
        builder.MapPost("requestResetPassword", AuthRequestResetPasswordHandler)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE)
            .WithOpenApi(AuthSummaries.AuthRequesResetPasswordSpecification);
        
        return builder;
    }

    #region Register/Login
    
    /// <summary>
    /// Trata requisição de <c>/auth/register</c>
    /// </summary>
    /// <param name="registerUserRequest">Informações para cadastro do novo usuário.</param>
    /// <param name="controller">Controlador que irá gerenciar as necessidades da requisição.</param>
    /// <returns>Resposta da requisição.</returns>
    /// <permission cref="AuthorizationPolicies">Requisições não autenticadas são autorizadas.</permission>
    async private static Task<IResult> AuthRegisterEndpointHandler(
        HttpContext _,
        [FromBody] RegisterUserRequestModel registerUserRequest,
        [FromServices] IAuthController controller)
    {
        string jwtNewUser;
        try
        {
            (UserReadModel _, jwtNewUser) = await controller.RegisterNewUser(registerUserRequest);
        }
        catch(CursoNotFound ex)
        {
            return Results.NotFound(ex.Message);
        }
        catch(Exception e)
        {
            return Results.BadRequest(e.Message);
        }
                
        return Results.Content(jwtNewUser, statusCode: StatusCodes.Status201Created);
    }
    /// <summary>
    /// Trata requisição de <c>/auth/login</c>
    /// </summary>
    /// <param name="loginRequestModel">Informações do usuário para login, vindas do body da requisição.</param>
    /// <param name="controller">Controlador que irá gerenciar as necessidades da requisição.</param>
    /// <returns>Resposta da requisição.</returns>
    /// <permission cref="AuthorizationPolicies">Requisições não autenticadas são autorizadas.</permission>
    async private static Task<IResult> AuthLoginEndpointHandler(
        HttpContext _,
        [FromBody] UserLoginRequestModel loginRequestModel,
        [FromServices] IAuthController controller)
    {
        string jwtUser;
        try
        {
            (UserReadModel _, jwtUser) = await controller.LoginUser(loginRequestModel);
        }
        catch (UsuarioNotFoundException e)
        {
            return Results.NotFound(e.Message);
        }
        catch (InvalidLoginPasswordException)
        {
            return Results.Unauthorized();
        }
        catch(Exception e)
        {
            return Results.BadRequest(e.Message);
        }
        
        return Results.Content(jwtUser);
    }
    
    #endregion

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
        [FromServices] IAuthController controller)
    {
        int userId = int.Parse(context.User.Claims
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
        [FromServices] IAuthController controller)
    {
        int userId = int.Parse(context.User.Claims.First(c => c.Type == ClaimTypes.Name).Value);
        
        bool sended;
        try
        {
            sended = await controller.RequestConfirmationCode(userId);
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.Message);
        }
        
        return sended ? Results.Ok() : 
            Results.Problem("Não foi possível enviar o email de confirmação.",
                statusCode: StatusCodes.Status503ServiceUnavailable);
    }
    
    #endregion

    #region PasswordReset

    /// <summary>
    /// Trata da requisição de <c>/auth/resetPassword</c>
    /// </summary>
    /// <param name="context">Usado para pegar o ID do usuário nos Claims da requisição</param>
    /// <param name="resetUserPasswordRequestModel">Informações para recuperação da senha do usuário,
    /// vindas do corpo da requisição</param>
    /// <param name="controller">Controlador que irá gerenciar as nescessidades da requisição</param>
    /// <returns>Resposta da requisição</returns>
    /// <permission cref="AuthorizationPolicies">Permitido apenas usuários e administradores autenticados</permission>
    [ProducesResponseType(typeof(ResetUserPasswordReadModel), 200)]
    async private static Task<IResult> AuthResetPasswordHandler(
        HttpContext context,
        [FromBody] ResetUserPasswordRequestModel resetUserPasswordRequestModel,
        [FromServices] IAuthController controller)
    {
        ResetUserPasswordReadModel resetUserPasswordReadModel;
        try
        {
            resetUserPasswordReadModel = await controller
                .ResetUserPassword(resetUserPasswordRequestModel);
        }
        catch (Exception e) when (e is UsuarioNotFoundException or ResetPasswordCodeNotFoundException)
        {
            return Results.NotFound(e.Message);
        }
        catch(Exception e)
        {
            return Results.BadRequest(e.Message);
        }
        
        return Results.Ok(resetUserPasswordReadModel);
    }
    /// <summary>
    /// Trada da requisição de <c>/auth/requestResetPassword</c>
    /// </summary>
    /// <param name="context">Usado para pegar o ID do usuário nos Claims da requisição.</param>
    /// <param name="request">Corpo da requisição, contentdo as informações para requisitar o email de recuperação.</param>
    /// <param name="controller">Controlador que irá gerenciar as nescessidades da requisição.</param>
    /// <returns>Resposta da requisição</returns>
    /// <permission cref="AuthorizationPolicies">Permitido apenas usuários e administradores autenticados</permission>
    async private static Task<IResult> AuthRequestResetPasswordHandler(
        HttpContext context,
        [FromBody] RequestResetPasswordEmailRequestModel request,
        [FromServices] IAuthController controller)
    {
        bool sended;
        try
        {
            sended = await controller.RequestPasswordResetCode(request);
        }
        catch(Exception e)
        {
            return Results.BadRequest(e.Message);
        }
        
        return sended ? Results.Ok() : 
            Results.Problem("Não foi possível enviar o email de recuperação de senha.",
                statusCode: StatusCodes.Status503ServiceUnavailable);
    }

    #endregion
}