using StudyLabAPI.Models.Material.Enums;

namespace StudyLabAPI.Models.Material.DTOs
{
    public record RegisteredDocumentoModel
    {
        public int idDocumento { get; init; }

        public IFormFileCollection Files { get; set; }
        
        public string diretorioMaterial1 { get; init; }

        public string diretorioMaterial2 { get; init; }

        public TipoMaterial TipoMaterial { get; init; }

        public StatusDocumento status { get; init; }

        public int Idtopico { get; init; }

        public TipoArquivo tipoArquivo { get; init; }

        public int IdUsuario { get; init; }

        public string descricao { get; init; }
    }
}
