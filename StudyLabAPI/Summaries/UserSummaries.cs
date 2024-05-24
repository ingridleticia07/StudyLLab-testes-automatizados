using Microsoft.OpenApi.Models;

namespace StudyLabAPI.Summaries;

public static class UserSummaries
{
    public static OpenApiOperation GetUsersSpecificatiom(OpenApiOperation oas) => new(oas)
    {
        Summary = "Retorna informações dos usuários cadastrados na plataforma.",
        Responses = new()
        {
            { 
                "200", new()
                {
                    Description = "Informações dos usuarios",
                    Content =
                    {
                        {
                            "application/json", new()
                            {
                                Schema = new()
                                {
                                    Reference = new()
                                    {
                                        Type = ReferenceType.Schema,
                                        Id = "UserReadModel[]"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {"403", new()
            {
                Description = "O usuário não tem permissão para acessar essa rota."
            }}
        }
    };
    public static OpenApiOperation UserProfileInfoSpecification(OpenApiOperation oas) => new(oas)
    {
        Summary = "Retorna as informações do usuario autenticado",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Informações do usuário",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = "UserReadModel"
                            }
                        }
                    }}
                }
            }},
            {"401", new()
            {
                Description = "O usuário não está autenticado."
            }},
            {"404", new()
            {
                Description = "O usuário não foi encontrado."
            }}
        }
    };
}