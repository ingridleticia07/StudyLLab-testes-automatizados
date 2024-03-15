using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Models.Enums;

namespace StudyLabAPI.Models
{
    public class RegisteredDocumentoModel : Controller
    {
        public int idDocumento { get; set; }

        public DateOnly dataCadastro { get; set; }

        public string diretorioMaterial { get; set; }

        public tipoMaterialEnum TipoMaterial { get; set; }

        public int Idtopico { get; set; }
    }
}
