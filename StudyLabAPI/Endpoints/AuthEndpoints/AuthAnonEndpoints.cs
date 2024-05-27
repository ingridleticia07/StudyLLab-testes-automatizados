using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Middlewares.Auth;
using StudyLabAPI.Models;
using StudyLabAPI.Summaries;

namespace StudyLabAPI.Endpoints.AuthEndpoints;

public static class AuthAnonEndpoints
{
    public static RouteGroupBuilder MapAnonAuthEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPut("resetPassword", AuthResetPasswordHandler)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE)
            .WithOpenApi(AuthSummaries.AuthResetPasswordSpecification);
        builder.MapPost("requestResetPassword", AuthRequestResetPasswordHandler)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE)
            .WithOpenApi(AuthSummaries.AuthRequesResetPasswordSpecification);
        builder.MapPost("register", AuthRegisterEndpointHandler)
            .WithOpenApi(AuthSummaries.AuthRegisterSpecification);
        builder.MapPost("login", AuthLoginEndpointHandler)
            .WithOpenApi(AuthSummaries.AuthLoginSpecification);

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
        catch(CursoNotFoundException ex)
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