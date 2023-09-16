using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Models;
using StudyLabAPI.Services.Email;
using StudyLabAPI.Services.Email.Models;
using StudyLabAPI.Services.Jwt;
using StudyLabAPI.Services.Jwt.Models;

namespace StudyLabAPI.Endpoints;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost("register", 
            async (HttpContext _,
                [FromBody] RegisterUserRequestModel registerUserRequest,
                [FromServices] EmailService emailService) =>
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
                catch(Exception e)
                {
                    return Results.BadRequest();
                }
                
                return Results.Ok($"Cadastrar usuario: {registerUserRequest.username}");
            });
        
        builder.MapPost("login",
            (HttpContext _,
                [FromBody] UserLoginModel loginModel,
                [FromServices] JwtService jwtService) =>
        {
            JwtPayload payload = new(Guid.NewGuid().ToString(), loginModel.username);
            string token = jwtService.GenerateJwt(payload);
            
            return Results.Ok(token);
        });
        
        return builder;
    }
}