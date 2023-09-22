using Microsoft.OpenApi.Models;

namespace StudyLabAPI.Summaries;

public static class AuthSummaries
{
    public static OpenApiOperation AuthRegisterSpecification(OpenApiOperation oas) => new(oas)
    {
        Summary = "Cria um novo usuário"
    };
    public static OpenApiOperation AuthLoginSpecification(OpenApiOperation oas) => new(oas)
    {
        Summary = "Autentica um usuário"
    };
}