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
    
    public static OpenApiOperation AuthConfirmEmailSpecification(OpenApiOperation oas) => new(oas)
    {
        Summary = "Usa o código de confirmação para confirmar o email, se o código não for valido, a confirmação não acontecerá.",
        Responses = new()
        {
            {"200", new()
            {
               Description = "Email confirmado com sucesso.",
               Content = {
                   {"application/json", new()
                   {
                       Schema = new()
                       {
                           Reference = new()
                           {
                               Type = ReferenceType.Schema,
                               Id = "CodigoUsuarioReadModel"
                           }
                       }
                   }}
               }
            }},
            {"404", new()
            {
                Description = "O usuário ou código de confirmação não foram encontrados."
            }},
            {"400", new()
            {
                Description = "Erro ao confirmar email."
            }}
        }
    };
    
    public static OpenApiOperation AuthResendConfirmationEmailSpecification(OpenApiOperation oas) => new(oas)
    {
        Summary = "Reenvia o código de confirmação para o email do usuário.",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Email de confirmação reenviado com sucesso."
            }},
            {"404", new()
            {
                Description = "O usuário não foi encontrado."
            }},
            {"400/503", new()
            {
                Description = "Erro ao enviar email de confirmação."
            }}
        }
    };
    
    public static OpenApiOperation AuthResetPasswordSpecification(OpenApiOperation oas) => new(oas)
    {
        Summary = "Redefine a senha atual do usuário, se o código de recuperação não for valido, a redefinição não acontecerá.",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Senha redefinida com sucesso.",
                Content = {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = "ResetUserPasswordReadModel"
                            }
                        }
                    }}
                }
            }},
            {"404", new()
            {
                Description = "O usuário ou o codigo de recuperação não foram encontrados."
            }},
            {"400", new()
            {
                Description = "Erro ao redefinir senha."
            }}
        }
    };
    
    public static OpenApiOperation AuthRequesResetPasswordSpecification(OpenApiOperation oap) => new(oap)
    {
        Summary = "Requisita um código de recuperação de senha para o email do usuário.",
        Responses = new()
        {
            {"200", new()
            {
                Description = "Código de recuperação de senha enviado com sucesso."
            }},
            {"400/503", new()
            {
                Description = "Erro ao enviar email de recuperação de senha."
            }}
        }
    };
}