using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using StudyLabAPI.Models.User;

namespace StudyLabAPI.Models.Forum
{
    [Table("resposta_forum")]
    public class RespostaForumModel
    {
        [Key]
        [Column("id_resposta")]
        public int idResposta { get; set; }

        [Column("resposta")]
        public string resposta { get; set; }

        [Column("data_resposta")]

        public DateOnly dataResposta { get; set; }

        [ForeignKey("fk_topico")]
        public TopicoDiscussaoModel topicoDiscussao { get; set; }

        [ForeignKey("fk_usuario")]
        public UsuarioModel usuario { get; set; }
    }
}
