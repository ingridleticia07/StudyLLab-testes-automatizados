using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using StudyLabAPI.Models.Auth.Enums;
using StudyLabAPI.Models.User;

namespace StudyLabAPI.Models.Auth;

[Table("codigo_usuario")]
public class CodigoUsuarioModel
{
    [Column("id_codigo")]
    [Required]
    [Key]
    public int id { get; set; }
    
    [ForeignKey("fk_usuario")]
    [Required]
    public UsuarioModel usuarioModel { get; set; }

    [Column("codigo_usuario")]
    [MaxLength(45)]
    [Required]
    public string codigo { get; set; }
    
    [Column("tipo")]
    [Required]
    public UserCodeKind tipo { get; set; }
}