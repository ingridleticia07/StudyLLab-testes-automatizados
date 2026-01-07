using StudyLabAPI.Models.Material.Enums;
using StudyLabAPI.Models.User;

namespace StudyLabAPI.Models.Material.DTOs
{
    public record DenunciaReadModel
    {
        public int idDenuncia { get; init; }

        public UsuarioModel usuario { get; init; }

        public DocumentoModel documento { get; init; }

        public statusDenunciaEnum statusDenuncia { get; init; }

        public statusDocumentoEnum statusDocumento { get; init; }

        public DateOnly dataDenuncia { get; init; }

        public string descricao { get; init; }
    }
}
