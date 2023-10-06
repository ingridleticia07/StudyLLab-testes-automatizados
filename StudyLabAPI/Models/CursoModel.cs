using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyLabAPI.Models;

[Table("curso")]
public class CursoModel
{
    [Key] public int id_curso { get; set; }
    public string nome_curso { get; set; }

}