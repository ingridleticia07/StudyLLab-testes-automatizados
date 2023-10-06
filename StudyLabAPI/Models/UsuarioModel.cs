using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyLabAPI.Models;

[Table("usuario")]
public class UsuarioModel
{
    [Key]
    public int id_usuario { get; set; }
    public string email_usuario { get; set; }

    public int codigo_usuario { get; set; }

    public string senha_usuario { get; set; }
    public bool status_usuario { get; set; }

    public int tipo_usuario { get; set; }

    [ForeignKey("fk_curso")] 
    public CursoModel curso { get; set; }

    public string? nome_usuario { get; set; }
}