using Microsoft.AspNetCore.Mvc;

namespace StudyLabAPI.Models
{
    public class RegisteredDocumentoModel : Controller
    {
        public int idDocumento { get; set; }

        public DateOnly dataCadastro { get; set; }

        public string diretorioMaterial { get; set; }

        public int tipoMaterial { get; set; }

        public int topico { get; set; }
    }
}
