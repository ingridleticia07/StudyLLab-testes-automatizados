using Microsoft.OpenApi.Models;

namespace StudyLabAPI.Summaries;

public static class UserSummaries
{
    public static OpenApiOperation AdminGetUsersSpecificatiom(OpenApiOperation oas) => new(oas)
    {
        Summary = "Retorna informações dos usuários cadastrados na plataforma. (Admin)",
        Responses = new()
        {
            {
                "200", new()
                {
                    Description = "Informações dos usuários",
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
                                        Id = "UsersListResponse"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                "403", new()
                {
                    Description = "O usuário não tem permissão para acessar essa rota."
                }
            }
        }
    };

    public static OpenApiOperation AdminPutUpdateUserSpecification(OpenApiOperation oas) => new(oas)
    {
        Summary = "Atualiza as informações de um usuário. (Admin)",
        Responses = new()
        {
            {
                "200", new()
                {
                    Description = "Informações do usuário atualizadas.",
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
                                        Id = "UserReadModel"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                "401", new()
                {
                    Description = "O usuário não está autenticado."
                }
            },
            {
                "403", new()
                {
                    Description =
                        "O usuário não tem permissão para acessar essa rota. Esta rota só pode ser acessada por administradores."
                }
            },
            {
                "404", new()
                {
                    Description = "O usuário não foi encontrado."
                }
            }
        }
    };

    public static OpenApiOperation AdminDeleteUserSpecefication(OpenApiOperation oas) => new(oas)
    {
        Summary = "Deleta um usuário. (Admin)",
        Responses = new()
        {
            {
                "200", new()
                {
                    Description = "Usuário deletado.",
                }
            },
            {
                "401", new()
                {
                    Description = "O usuário não está autenticado."
                }
            },
            {
                "403", new()
                {
                    Description =
                        "O usuário não tem permissão para acessar essa rota. Esta rota só pode ser acessada por administradores."
                }
            },
            {
                "404", new()
                {
                    Description = "O usuário não foi encontrado."
                }
            }
        }
    };
    public static OpenApiOperation GetUserProfileInfoSpecification(OpenApiOperation oas) => new(oas)
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