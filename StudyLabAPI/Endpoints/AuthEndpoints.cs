using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Controllers;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Models;
using StudyLabAPI.Services.Email;
using StudyLabAPI.Services.Email.Models;
using StudyLabAPI.Services.Jwt;
using StudyLabAPI.Services.Jwt.Models;
using StudyLabAPI.Summaries;

namespace StudyLabAPI.Endpoints;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost("register", AuthRegisterEndpointHandler)
            .WithOpenApi(AuthSummaries.AuthRegisterSpecification);
        builder.MapPost("login", AuthLoginEndpointHandler)
            .WithOpenApi(AuthSummaries.AuthLoginSpecification);
        
        return builder;
    }

    private static async Task<IResult> AuthLoginEndpointHandler(
        HttpContext _,
        [FromBody] UserLoginRequestModel loginRequestModel,
        [FromServices] JwtService jwtService,
        [FromServices] IAuthController controller)
    {
        string jwtUser;
        try
        {
            UserReadModel userReadModel = await controller.LoginUser(loginRequestModel);
            jwtUser = jwtService.GenerateJwt(new(userReadModel.id.ToString(), userReadModel.role));
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

    private static async Task<IResult> AuthRegisterEndpointHandler(
        HttpContext _,
        [FromBody] RegisterUserRequestModel registerUserRequest,
        [FromServices] EmailService emailService,
        [FromServices] JwtService jwtService,
        [FromServices] IAuthController controller)
    {
        string jwtNewUser;
        EmailIntent emailIntent = new()
        {
            toEmail = registerUserRequest.email,
            subject = "Bem vindo ao StudyLab",
            message = $"Olá {registerUserRequest.username}, seja bem vindo ao StudyLab"
        };
        try
        {
            UserReadModel newUserId = await controller.RegisterNewUser(registerUserRequest);
            JwtPayload payload = new(newUserId.id.ToString(), newUserId.role);
        
            jwtNewUser = jwtService.GenerateJwt(payload);
            await emailService.SendEmail(emailIntent);
        }
        catch(CursoNotFound ex)
        {
            return Results.NotFound(ex.Message);
        }
        catch(Exception)
        {
            return Results.BadRequest();
        }
                
        return Results.Ok(jwtNewUser);
    }
}