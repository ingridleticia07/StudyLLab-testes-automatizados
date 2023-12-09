using Microsoft.OpenApi.Models;
using StudyLabAPI.Models;

namespace StudyLabAPI.Summaries
{
    public static class MaterialSummaries
    {
        public static OpenApiOperation CreateDocumento(OpenApiOperation oas) => new(oas)
        {
            Summary = "Cadastra um documento na tabela documento",
            Responses = new()
        {
            {"200", new()
            {
                Description = "documento cadastrado com sucesso.",
                Content =
                {
                    {"application/json", new()
                    {
                        Schema = new()
                        {
                            Reference = new()
                            {
                                Type = ReferenceType.Schema,
                                Id = nameof(RegisteredDocumentoModel)
                            }
                        }
                    }}
                }
            }},
            {"400", new()
            {
                Description = "Error ao cadastrar documento."
            }}
        }
        };
    }

}
