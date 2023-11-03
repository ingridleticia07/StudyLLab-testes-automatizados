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
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE);
        builder.MapPost("resendConfirmationEmail", AuthResendConfirmationEmail)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE);
        builder.MapPut("resetPassword", AuthResetPasswordHandler)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE);
        builder.MapPost("requestResetPassword", AuthRequestResetPasswordHandler)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_USER_ROLE);
        
        return builder;
    }

    private static async Task<IResult> AuthResetPasswordHandler(
        HttpContext context,
        [FromBody] ResetUserPasswordRequestModel resetUserPasswordRequestModel,
        [FromServices] IAuthController controller)
    {
        int userId = int.Parse(context.User.Claims
            .First(c => c.Type == ClaimTypes.Name).Value);
        
        ResetUserPasswordReadModel resetUserPasswordReadModel;
        try
        {
            resetUserPasswordReadModel = await controller
                .ResetUserPassword(resetUserPasswordRequestModel, userId);
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

    private static async Task<IResult> AuthRequestResetPasswordHandler(
        HttpContext context,
        [FromServices] IAuthController controller)
    {
        int userId = int.Parse(context.User.Claims
            .First(c => c.Type == ClaimTypes.Name).Value);
        
        bool sended;
        try
        {
            sended = await controller.RequestPasswordResetCode(userId);
        }
        catch(Exception e)
        {
            return Results.BadRequest(e.Message);
        }
        
        return sended ? Results.Ok() : 
            Results.Problem("Não foi possível enviar o email de recuperação de senha.",
                statusCode: StatusCodes.Status503ServiceUnavailable);
    }

    private static async Task<IResult> AuthConfirmEmailHandler(
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
    private static async Task<IResult> AuthResendConfirmationEmail(
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
    /// <summary>
    /// Trata requisição de <c>/auth/register</c>
    /// </summary>
    /// <param name="registerUserRequest">Informações para cadastro do novo usuário.</param>
    /// <param name="controller">Controlador que irá gerenciar as necessidades da requisição.</param>
    /// <returns>Resposta da requisição.</returns>
    /// <permission cref="AuthorizationPolicies">Requisições não autenticadas são autorizadas.</permission>
    private static async Task<IResult> AuthRegisterEndpointHandler(
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
    private static async Task<IResult> AuthLoginEndpointHandler(
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
}