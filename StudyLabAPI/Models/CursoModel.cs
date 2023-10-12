using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyLabAPI.Models;

[Table("curso")]
public class CursoModel
{   
    [Key]
    [Column("id_curso")]
    public int idCurso { get; set; }

    [Column("nome_curso")]
    [Required]
    [MaxLength(45)]
    public string nomeCurso { get; set; }

}