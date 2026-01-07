using StudyLabAPI.Models.Material.Enums;
using StudyLabAPI.Models.User;

namespace StudyLabAPI.Models.Material.DTOs
{
    public class DenunciaReadModel
    {
        public int idDenuncia { get; set; }

        public UsuarioModel usuario { get; set; }

        public DocumentoModel documento { get; set; }

        public statusDenunciaEnum statusDenuncia { get; set; }

        public statusDocumentoEnum statusDocumento { get; set; }

        public DateOnly dataDenuncia { get; set; }

        public string descricao { get; set; }
    }
}
