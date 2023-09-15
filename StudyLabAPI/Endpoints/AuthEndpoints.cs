using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Models;
using StudyLabAPI.Services.Jwt;
using StudyLabAPI.Services.Jwt.Models;

namespace StudyLabAPI.Endpoints;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost("register", 
            (HttpContext _,
                [FromBody] RegisterUserRequestModel registerUserRequest) =>
            {
                try
                {
                    //controller
                }
                catch(Exception)
                {
                    
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