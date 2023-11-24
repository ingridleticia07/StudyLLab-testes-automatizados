using Microsoft.OpenApi.Models;
using StudyLabAPI.Models;

namespace StudyLabAPI.Summaries;

public static class ForumSummaries
{
    public static OpenApiOperation ForumGetAllTopicosDiscussao(OpenApiOperation oas) => new(oas)
    {
        Summary = "Recupera todas as discuções de todos os tópico",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Discussões recuperadas com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(List<TopicoDiscussaoModel>)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao recuperar discussões."
            }}
        }
    };
    
    public static OpenApiOperation ForumCreateTopicoDiscussao(OpenApiOperation oas) => new(oas)
    {
        Summary = "Verifica se o tópico de discussão existe, se não, cria um novo",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Tópico de discussão criado com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(RegisteredTopicoDiscussaoRequestModel)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao criar tópico."
            }},
            {"409", new()
            {
                Description = "Tópico de discussão já existe."
            }}
        }
    };
    
    public static OpenApiOperation ForumUpdateTopicoDiscussao(OpenApiOperation oas) => new(oas)
    {
        Summary = "Verifica se o tópico de discussão existe, se sim, atualiza o tópico de discussão",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Tópico de discussão atualizado com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(RegisteredTopicoDiscussaoRequestModel)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao atualizar tópico."
            }},
            {"409", new()
            {
                Description = "Tópico de discussão já existe."
            }}
        }
    };
    
    public static OpenApiOperation ForumDeleteTopicoDiscussao(OpenApiOperation oas) => new(oas)
    {
        Summary = "Deleta um tópico de discussão pelo ID",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Tópico de discussão apagado com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(TopicoDiscussaoModel)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao deletar discussões."
            }}
        }
    };
    
    public static OpenApiOperation ForumGetAllRespostaForum(OpenApiOperation oas) => new(oas)
    {
        Summary = "Recupera todas as reposta do fórum",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Respostas recuperadas com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(List<RespostaForumModel>)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao recuperar as respostas."
            }}
        }
    };
    
    public static OpenApiOperation ForumCreateRespostaForum(OpenApiOperation oas) => new(oas)
    {
        Summary = "Verifica se a reposta do fórum existe, se não, a resposta é criada",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Reposta do fórum criada com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(RegisteredRespostaForumModel)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao criar resposta."
            }},
            {"409", new()
            {
                Description = "Reposta do fórum já existe."
            }}
        }
    };
    
    public static OpenApiOperation ForumUpdateRespostaForum(OpenApiOperation oas) => new(oas)
    {
        Summary = "Verifica se a reposta do fórum existe, se sim, a resposta é atualizada",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Reposta do fórum atualizada com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(RegisteredRespostaForumModel)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao atualizar resposta."
            }},
            {"409", new()
            {
                Description = "Reposta do fórum já existe."
            }}
        }
    };
    
    public static OpenApiOperation ForumDeleteRespostaForum(OpenApiOperation oas) => new(oas)
    {
        Summary = "Deleta a reposta do fórum pelo ID",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Reposta do fórum apagada com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(RespostaForumModel)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao apagar resposta."
            }}
        }
    };
    
    public static OpenApiOperation ForumCreateForum(OpenApiOperation oas) => new(oas)
    {
        Summary = "Verifica se o fórum existe, se não, o fórum é criado",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Fórum criado com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(ResgisteredForumModel)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao criar fórum."
            }},
            {"409", new()
            {
                Description = "Fórum já existe."
            }}
        }
    };
    
    public static OpenApiOperation ForumUpdateForum(OpenApiOperation oas) => new(oas)
    {
        Summary = "Verifica se o fórum existe, se sim, o fórum é atualizado",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Fórum atualizado com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(ResgisteredForumModel)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao atualizar fórum."
            }},
            {"409", new()
            {
                Description = "Fórum já existe."
            }}
        }
    };
    
    public static OpenApiOperation ForumGetForums(OpenApiOperation oas) => new(oas)
    {
        Summary = "Recupera todos os fóruns",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Fórums recuperados com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(List<ForumModel>)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao recuperar os fórums."
            }}
        }
    };
    
    public static OpenApiOperation ForumDeleteForum(OpenApiOperation oas) => new(oas)
    {
        Summary = "Deleta o fórum pelo ID",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Fórum apagado com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(ForumModel)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao apagar os fórum."
            }}
        }
    };
    
    public static OpenApiOperation ForumGetForumByTopico(OpenApiOperation oas) => new(oas)
    {
        Summary = "Recupar fórum pelo ID do tópico",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Fórums recuperados com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(List<ForumModel>)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao recuperar os fórums."
            }}
        }
    };
}