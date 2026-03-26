using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using StudyLabAPI.Models.Material.Enums;
using StudyLabAPI.Models.User;

namespace StudyLabAPI.Models.Material
{
    public class DenunciaModel
    {
        [Key]
        [Column("id_denuncia")]
        public int idDenuncia { get; set; }

        [ForeignKey("fk_usuario")]
        public UsuarioModel usuario { get; set; }

        [ForeignKey("fk_documento")]
        public DocumentoModel documento { get; set; }

        [Column("status_denuncia")]
        [Required]
        public StatusDenuncia statusDenuncia { get; set; }

        [Column("data_denuncia")]
        [Required]
        public DateOnly dataDenuncia { get; set; }
        
        [Column("descricao")]
        public string descricao { get; set; }
    }
}
