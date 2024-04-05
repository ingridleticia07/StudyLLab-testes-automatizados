namespace StudyLabAPI.Endpoints.AuthEndpoints;

public static class AuthenticationEndpoints
{
    public static RouteGroupBuilder MapAuthenticationEndpoints(this RouteGroupBuilder builder)
    {
        RouteGroupBuilder authSecGroup = builder
            .MapGroup("sec");
        authSecGroup.MapAuthSecEndpoints();
        
        RouteGroupBuilder authAnonGroup = builder
            .MapGroup("/")
            .AllowAnonymous();
        authAnonGroup.MapAnonAuthEndpoints();
        
        return builder;
    }
}