using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using StudyLabAPI.Models.User;

namespace StudyLabAPI.Models.Forum
{
    [Table("forum")]
    public class ForumModel
    {
        [Key]

        [Column("id_forum")]
        public int idForum { get; set; }

        [ForeignKey("fk_resposta_forum")]

        public RespostaForumModel respostaForum { get;set; }

        [ForeignKey("fk_usuario")]

        public UsuarioModel usuario { get; set; }
    }
}
