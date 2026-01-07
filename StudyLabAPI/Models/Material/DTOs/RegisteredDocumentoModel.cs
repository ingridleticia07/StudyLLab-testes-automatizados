using StudyLabAPI.Models.Material.Enums;

namespace StudyLabAPI.Models.Material.DTOs
{
    public record RegisteredDocumentoModel
    {
        public int idDocumento { get; init; }

        public string diretorioMaterial1 { get; init; }

        public string diretorioMaterial2 { get; init; }

        public tipoMaterialEnum TipoMaterial { get; init; }

        public statusDocumentoEnum status { get; init; }

        public int Idtopico { get; init; }

        public tipoArquivo tipoArquivo { get; init; }

        public int IdUsuario { get; init; }

        public string descricao { get; init; }
    }
}
