using System.ComponentModel.DataAnnotations;

namespace StudyLabAPI.Models
{
    public class CursoModel
    {
        [Key] public int id_curso { get; set; }
        public string nome_curso { get; set; }

    }
}
