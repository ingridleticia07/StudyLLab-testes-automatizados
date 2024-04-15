using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;

namespace StudyLabAPI.Summaries;

public static class UtilsSummaries
{
    public static OpenApiOperation CheckAuthStateSpecifications(OpenApiOperation oas) => new(oas)
    {
        Summary = "Verifica se o usuário está autenticado e se o token é válido",
        Responses = new()
        {
            {
                "200", new()
                {
                    Description = "O usuários está autenticado e o token é válido."
                }
            },
            {
                "401", new()
                {
                    Description = "O usuário não está autenticado ou o token é inválido."
                }
            }
        }
    };
    
    public static OpenApiOperation CheckHealthSpecifications(OpenApiOperation oas) => new(oas)
    {
        Summary = "Verifica se a aplicação está funcionando corretamente",
        Responses = new()
        {
            {
                "200", new()
                {
                    Description = "A aplicação está OK",
                    Content =
                    {
                        {
                            "application/content", new()
                            {
                                Schema = new()
                                {
                                    Type = "string"
                                },
                                Example = new OpenApiString("OK")
                            }
                        }
                    }
                }
            },
            {
                "500", new()
                {
                    Description = "A aplicação não está funcionando corretamente"
                }
            },
            {
                "401", new()
                {
                    Description = "O usuário não está autenticado ou o token é inválido."
                }
            }
        }
    };
}