using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Models.Enums;

namespace StudyLabAPI.Models
{
    public class RegisteredDocumentoModel
    {
        public int idDocumento { get; set; }

        public string diretorioMaterial { get; set; }

        public tipoMaterialEnum TipoMaterial { get; set; }

        public statusDocumentoEnum status { get; set; }

        public int Idtopico { get; set; }

        public tipoArquivo tipoArquivo { get; set; }

        public int IdUsuario { get; set; }
    }
}
