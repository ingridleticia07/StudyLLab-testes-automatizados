using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyLabAPI.Models
{
    [Table("topico_discussao")]
    public class TopicoDiscussaoModel
    {
        [Key]
        [Column("id_topico")]
        public int idTopico { get; set; }

        [Column("nome_topico")]
        public string nomeTopico { get; set; }

        [Column("data_topico")]
        public DateOnly dataTopico { get; set; }

        [ForeignKey("fk_disciplina")]
        public DisciplinaModel disciplina { get; set; }

        [ForeignKey("fk_created_user")]
        public UsuarioModel usuario { get; set; }

        public static implicit operator TopicoDiscussaoModel(bool v)
        {
            throw new NotImplementedException();
        }
    }
}
