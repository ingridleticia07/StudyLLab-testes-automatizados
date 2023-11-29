using Microsoft.OpenApi.Models;
using StudyLabAPI.Models;

namespace StudyLabAPI.Summaries;

public static class DisciplinaSummaries
{
    public static OpenApiOperation DisciplinaGetDisciplinas(OpenApiOperation oas) => new(oas)
    {
        Summary = "Recupera todas as disciplinas",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Disciplinas recuperadas com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(List<DisciplinaReadModel>)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao recuperar disciplinas."
            }}
        }
    };
    
    public static OpenApiOperation DisciplinaGetDisciplina(OpenApiOperation oas) => new(oas)
    {
        Summary = "Recupera uma disciplina pelo ID",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Disciplina recuperadas com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(DisciplinaReadModel)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao recuperar disciplina."
            }}
        }
    };
    
    public static OpenApiOperation DisciplinaCreateDisciplina(OpenApiOperation oas) => new(oas)
    {
        Summary = "Verifica se a disciplina existe, se não existir, cria uma nova disciplina",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Disciplina cadastrada com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(DisciplinaReadModel)
                            }
                        }
                    }}
                }
            }},
            {"409", new()
            {
                Description = "Disciplina já existe."
            }},
            {"400", new()
            {
                Description = "Error ao criar disciplina."
            }}
        }
    };
    
    public static OpenApiOperation DisciplinaUpdateDisciplina(OpenApiOperation oas) => new(oas)
    {
        Summary = "Verifica se a disciplina existe, se existir, atualiza a disciplina",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Disciplina atualizada com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(RegisterDisciplinaRequestModel)
                            }
                        }
                    }}
                }
            }},
            {"409", new()
            {
                Description = "Disciplina já existe."
            }},
            {"400", new()
            {
                Description = "Error ao atualizar disciplina."
            }}
        }
    };
    
    public static OpenApiOperation DisciplinaDeleteDisciplina(OpenApiOperation oas) => new(oas)
    {
        Summary = "Deleta a disciplina pelo ID",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Disciplina apagada com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(DisciplinaModel)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao apagar disciplina."
            }}
        }
    };
}