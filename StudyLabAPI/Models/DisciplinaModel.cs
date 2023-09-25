using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyLabAPI.Models
{
    public class DisciplinaModel
    {
        [Key] public int id_disciplina { get; set; }
        public string nome_disciplina { get; set; }
        public string professor_disciplina { get; set; }
        [ForeignKey("id_curso")] public int fk_curso { get; set; }

        public CursoModel id_curso { get; set; }
        public int quantidade_aluno { get; set; }

        public string codigo_disciplina { get; set; }

    }
}
