using Microsoft.OpenApi.Models;

namespace StudyLabAPI.Summaries;

public static class UserSummaries
{
    public static OpenApiOperation UserGetByIdSpecification(OpenApiOperation oas) => new(oas)
    {
        Summary = "Retorna um usuário buscando pelo ID"
    };
}