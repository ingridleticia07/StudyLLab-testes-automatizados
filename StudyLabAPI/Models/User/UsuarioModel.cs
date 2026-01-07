using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using StudyLabAPI.Models.Curso;
using StudyLabAPI.Models.User.Enums;

namespace StudyLabAPI.Models.User;

[Table("usuario")]
public class UsuarioModel
{
    [Key]
    [Column("id_usuario")]
    public int idUsuario { get; set; }

    [Column("email_usuario")]
    [MaxLength(60)]
    [Required]
    public string emailUsuario { get; set; }

    [Column("matricula")]
    [Required]
    public string matricula { get; set; }

    [Column("senha_usuario")]
    [MaxLength(60)]
    [Required]
    public string senhaUsuario { get; set; }

    [Column("status_usuario")]
    [Required]
    public bool statusUsuario { get; set; }

    [Column("tipo_usuario")]
    [Required]
    public UserRole tipoUsuario { get; set; }

    [ForeignKey("fk_curso")]
    public CursoModel curso { get; set; }

    [Column("nome_usuario")]
    [MaxLength(45)]
    [Required]
    public string nomeUsuario { get; set; }

    [Column("data_cadastro_usuario")]
    [Required]
    public DateOnly dataCadastroUsuario { get; set; }

    [Column("imagem")]
    [MaxLength(45)]
    public string? imagemUsuario { get; set; }
}