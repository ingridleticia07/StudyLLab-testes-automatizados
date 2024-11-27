using StudyLabAPI.Models.Enums;

namespace StudyLabAPI.Models
{
    public class DenunciaReadModel
    {
        public int idDenuncia { get; set; }

        public UsuarioModel usuario { get; set; }

        public statusDenunciaEnum statusDenuncia { get; set; }

        public DateOnly dataDenuncia { get; set; }
    }
}
