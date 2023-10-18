using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;

namespace StudyLabAPI.Summaries;

public static class AuthSummaries
{
    public static OpenApiOperation AuthRegisterSpecification(OpenApiOperation oas) => new(oas)
    {
        Summary = "Cria um novo usuário",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Usuário cadastrado com sucesso. Retorna o JWT do usuário recém criado.",
                Content =
                {
                    {"text/plain", new()
                    {
                        Example = new OpenApiString("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEyIiwicm9sZSI6IjMiLCJuYmYiOjE2OTc1MDE1NzEsImV4cCI6MTY5NzUxOTU3MSwiaWF0IjoxNjk3NTAxNTcxLCJpc3MiOiJTdHVkeUxhYkFQSSIsImF1ZCI6IlN0dWR5TGFiV2ViIn0.LwgTkmG55VU5WV7ZOC8EWqn-gnt0RjvRAygZswq5wBk", true, true)
                    }}
                }
            }},
            {"404", new()
            {
                Description = "Usuário não encontrado."
            }},
            {"400", new()
            {
                Description = "Erro ao cadastrar usuário."
            }}
        }
    };
    public static OpenApiOperation AuthLoginSpecification(OpenApiOperation oas) => new(oas)
    {
        Summary = "Autentica um usuário já cadastrado.",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Usuário autenticado com sucesso. Retorna o JWT do usuário autenticado.",
                Content =
                {
                    {"text/plain", new()
                    {
                        Example = new OpenApiString("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEyIiwicm9sZSI6IjMiLCJuYmYiOjE2OTc1MDE1NzEsImV4cCI6MTY5NzUxOTU3MSwiaWF0IjoxNjk3NTAxNTcxLCJpc3MiOiJTdHVkeUxhYkFQSSIsImF1ZCI6IlN0dWR5TGFiV2ViIn0.LwgTkmG55VU5WV7ZOC8EWqn-gnt0RjvRAygZswq5wBk", true, true)
                    }}
                }
            }},
            {"404", new()
            {
                Description = "Usuário não encontrado."
            }},
            {"400", new()
            {
                Description = "Erro ao autenticar usuário."
            }}
        }
    };
}