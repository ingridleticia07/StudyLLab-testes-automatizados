using StudyLabAPI.Models.Material.Enums;

namespace StudyLabAPI.Models.Material.DTOs
{
    public class RegisteredDocumentoModel
    {
        public int idDocumento { get; set; }

        public string diretorioMaterial1 { get; set; }

        public string diretorioMaterial2 { get; set; }

        public tipoMaterialEnum TipoMaterial { get; set; }

        public statusDocumentoEnum status { get; set; }

        public int Idtopico { get; set; }

        public tipoArquivo tipoArquivo { get; set; }

        public int IdUsuario { get; set; }

        public string descricao { get; set; }
    }
}
