using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyLabAPI.Models;

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

    [Column("codigo_usuario")]
    [MaxLength(1)]
    [Required]
    public int codigoUsuario { get; set; }

    [Column("senha_usuario")]
    [MaxLength(60)]
    [Required]
    public string senhaUsuario { get; set; }

    [Column("status_usuario")]
    [MaxLength(1)]
    [Required]
    public bool statusUsuario { get; set; }

    [Column("tipo_usuario")]
    [MaxLength(1)]
    [Required]
    public int tipoUsuario { get; set; }

    [ForeignKey("fk_curso")]
    [Required]

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
    [Required]
    public string imagemUsuario { get; set; }
}