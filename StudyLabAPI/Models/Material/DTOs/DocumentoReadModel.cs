using StudyLabAPI.Models.Forum;
using StudyLabAPI.Models.Material.Enums;
using StudyLabAPI.Models.User;

namespace StudyLabAPI.Models.Material.DTOs
{
    public record DocumentoReadModel
    {
        public int idDocumento { get; init; }

        public DateOnly dataCadastro { get; init; }

        public string diretorioMaterial1 { get; init; }

        public string diretorioMaterial2 { get; init; }

        public StatusDocumento status { get; init; }

        public TipoMaterial tipoMaterial { get; init; }

        public TopicoDiscussaoModel topico { get; init; }

        public TipoArquivo tipoArquivo { get; init; }

        public UsuarioModel usuario { get; init; }

        public int professor {get; init;}
    }
}
