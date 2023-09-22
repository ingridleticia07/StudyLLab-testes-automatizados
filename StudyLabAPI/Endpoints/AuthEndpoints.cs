using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
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
        [FromBody] UserLoginModel loginModel,
        [FromServices] JwtService jwtService)
    {
        JwtPayload payload = new(Guid.NewGuid().ToString(), loginModel.username);
        string token = jwtService.GenerateJwt(payload);
            
        return Results.Ok(token);
    }

    private static async Task<IResult> AuthRegisterEndpointHandler(
        HttpContext _,
        [FromBody] RegisterUserRequestModel registerUserRequest,
        [FromServices] EmailService emailService)
    {
        EmailIntent emailIntent = new()
        {
            toEmail = registerUserRequest.email,
            subject = "Bem vindo ao StudyLab",
            message = $"Olá {registerUserRequest.username}, seja bem vindo ao StudyLab"
        };
        try
        {
            await emailService.SendEmail(emailIntent);
            //Move to controller
        }
        catch(Exception)
        {
            return Results.BadRequest();
        }
                
        return Results.Ok($"Cadastrar usuario: {registerUserRequest.username}");
    }
}