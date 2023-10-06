using Microsoft.OpenApi.Models;

namespace StudyLabAPI.Summaries;

public static class UserSummaries
{
    public static OpenApiOperation UserProfileInfoSpecification(OpenApiOperation oas) => new(oas)
    {
        Summary = "Retorna as informações do usuario autenticado"
    };
}