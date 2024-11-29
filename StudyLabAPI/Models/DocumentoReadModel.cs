using StudyLabAPI.Models.Enums;

namespace StudyLabAPI.Models
{
    public class DocumentoReadModel
    {
        public int idDocumento { get; set; }

        public DateOnly dataCadastro { get; set; }

        public string diretorioMaterial { get; set; }

        public statusDocumentoEnum status { get; set; }

        public tipoMaterialEnum tipoMaterial { get; set; }

        public TopicoDiscussaoModel topico { get; set; }

        public tipoArquivo tipoArquivo { get; set; }

        public UsuarioModel usuario { get; set; }
    }
}
