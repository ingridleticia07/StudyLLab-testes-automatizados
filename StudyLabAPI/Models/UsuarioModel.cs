using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyLabAPI.Models
{
    public class UsuarioModel
    {
        [Key] public int id_usuario { get; set; }
        public string email_usuario { get; set; }

        public int codigo_usuario { get; set; }

        public Boolean status_usuario { get; set; }

        public int tipo_usuario { get; set; }

        [ForeignKey("curso")] public int fk_curso { get; set; }
        CursoModel curso { get; set; }

        public string nome_usuario { get; set; }
    }
}
