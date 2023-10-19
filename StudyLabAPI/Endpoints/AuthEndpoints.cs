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
        
        return builder;
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
                
        return Results.Content(jwtNewUser);
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
        
        return Results.Ok(jwtUser);
    }
}