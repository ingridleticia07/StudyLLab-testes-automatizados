using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Middlewares.Auth;
using StudyLabAPI.Models;
using StudyLabAPI.Models.User.DTOs;
using StudyLabAPI.Services.Application.Auth;
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
        builder.MapPost("registerProfOrAdmin", AuthRegisterAdminOrProfEndpointHandler)
            .RequireAuthorization(AuthorizationPolicies.REQUIRE_IDENTIFIER_AND_ADMIN_ROLE)
            .WithOpenApi(AuthSummaries.AuthRegisterSpecification);
        builder.MapPut("resendVerificationCode", AuthResendVerificationCodeHandler)
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
    /// <param name="service">Serviço que irá gerenciar as necessidades da requisição.</param>
    /// <returns>Resposta da requisição.</returns>
    /// <permission cref="AuthorizationPolicies">Requisições não autenticadas são autorizadas.</permission>
    async private static Task<IResult> AuthRegisterEndpointHandler(
        HttpContext _httpContext,
        [FromBody] RegisterUserRequestModel registerUserRequest,
        [FromServices] IAuthService service)
    {
        string jwtNewUser = null;
        int userId = 0;

        try
        {
            (UserReadModel _, jwtNewUser, userId) = await service.RegisterNewUser(registerUserRequest, _httpContext);
        }
        catch (CursoNotFoundException ex)
        {
            return Results.NotFound(new { message = ex.Message, tipo = 1 });
        }
        catch (Exception e)
        {
            return Results.BadRequest(new { message = e.Message, tipo = 2 });
        }

        object retorno = new
        {
            tokenJwt = jwtNewUser,
            idUsuario = userId
        };

        return Results.Json(retorno);
    }

    async private static Task<IResult> AuthRegisterAdminOrProfEndpointHandler(
        HttpContext _httpContext,
        [FromBody] RegisterUserRequestModel registerUserRequest,
        [FromServices] IAuthService service)
    {

        try
        {
            await service.RegisterNewAdminOrProf(registerUserRequest);
        }
        catch (CursoNotFoundException ex)
        {
            return Results.NotFound(new { message = ex.Message, tipo = 1 });
        }
        catch (Exception e)
        {
            return Results.BadRequest(new { message = e.Message, tipo = 2 });
        }

        return Results.Ok();
    }

    async private static Task<IResult> AuthResendVerificationCodeHandler(
        HttpContext _,
        [FromQuery] int userId,
        [FromServices] IAuthService service)
    {
        try
        {
            await service.ResendVerificationCode(userId);
        }
        catch (CursoNotFoundException ex)
        {
            return Results.NotFound(ex.Message);
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.Message);
        }

        object retorno = new
        {
            statusCode = StatusCodes.Status201Created,
            userId = userId
        };

        return Results.Json(retorno);
    }
    /// <summary>
    /// Trata requisição de <c>/auth/login</c>
    /// </summary>
    /// <param name="loginRequestModel">Informações do usuário para login, vindas do body da requisição.</param>
    /// <param name="service">Serviço que irá gerenciar as necessidades da requisição.</param>
    /// <returns>Resposta da requisição.</returns>
    /// <permission cref="AuthorizationPolicies">Requisições não autenticadas são autorizadas.</permission>
    async private static Task<IResult> AuthLoginEndpointHandler(
        HttpContext _httpContext,
        [FromBody] UserLoginRequestModel loginRequestModel,
        [FromServices] IAuthService service)
    {
        string jwtUser;
        int userId = 0;

        try
        {
            (UserReadModel _, jwtUser, userId) = await service.LoginUser(loginRequestModel, _httpContext);
        }
        catch (UsuarioNotFoundException e)
        {
            return Results.NotFound(e.Message);
        }
        catch (InvalidLoginPasswordException)
        {
            return Results.Unauthorized();
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.Message);
        }

        object retorno = new
        {
            tokenJwt = jwtUser,
            idUsuario = userId
        };

        return Results.Json(retorno);
    }

    #endregion

    #region PasswordReset

    /// <summary>
    /// Trata da requisição de <c>/auth/resetPassword</c>
    /// </summary>
    /// <param name="context">Usado para pegar o ID do usuário nos Claims da requisição</param>
    /// <param name="resetUserPasswordRequestModel">Informações para recuperação da senha do usuário,
    /// vindas do corpo da requisição</param>
    /// <param name="service">Serviço que irá gerenciar as nescessidades da requisição</param>
    /// <returns>Resposta da requisição</returns>
    /// <permission cref="AuthorizationPolicies">Permitido apenas usuários e administradores autenticados</permission>
    [ProducesResponseType(typeof(ResetUserPasswordReadModel), 200)]
    async private static Task<IResult> AuthResetPasswordHandler(
        HttpContext context,
        [FromBody] ResetUserPasswordRequestModel resetUserPasswordRequestModel,
        [FromServices] IAuthService service)
    {
        ResetUserPasswordReadModel resetUserPasswordReadModel;
        try
        {
            resetUserPasswordReadModel = await service
                .ResetUserPassword(resetUserPasswordRequestModel);
        }
        catch (Exception e) when (e is UsuarioNotFoundException)
        {
            return Results.NotFound(new
            {
                status = 404,
                Message = e.Message
            });
        }
        catch(Exception e) when(e is ResetPasswordCodeNotFoundException) 
        {
            return Results.NotFound(new
            {
                status = 400,
                Message = e.Message
            });
        }
        catch (Exception e)
        {
            return Results.NotFound(new
            {
                status = 400,
                Message = e.Message
            });
        }

        return Results.Ok(new {
            status = 200,
            Message = "Senha resetada com sucesso!"
        });
    }
    /// <summary>
    /// Trada da requisição de <c>/auth/requestResetPassword</c>
    /// </summary>
    /// <param name="context">Usado para pegar o ID do usuário nos Claims da requisição.</param>
    /// <param name="request">Corpo da requisição, contentdo as informações para requisitar o email de recuperação.</param>
    /// <param name="service">Serviço que irá gerenciar as nescessidades da requisição.</param>
    /// <returns>Resposta da requisição</returns>
    /// <permission cref="AuthorizationPolicies">Permitido apenas usuários e administradores autenticados</permission>
    async private static Task<IResult> AuthRequestResetPasswordHandler(
        HttpContext context,
        [FromBody] RequestResetPasswordEmailRequestModel request,
        [FromServices] IAuthService service)
    {
        bool sended;
        try
        {
            sended = await service.RequestPasswordResetCode(request);
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.Message);
        }

        return sended ? Results.Ok() :
            Results.Problem("Não foi possível enviar o email de recuperação de senha.",
                statusCode: StatusCodes.Status503ServiceUnavailable);
    }

    #endregion
}