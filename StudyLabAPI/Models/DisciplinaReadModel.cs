using System.ComponentModel.DataAnnotations.Schema;

namespace StudyLabAPI.Models
{
    public class DisciplinaReadModel
    {
        public int idDisciplina { get; set; }

        public string nomeDisciplina { get; set; }

        public string professorDisciplina { get; set; }

        public CursoReadModel curso { get; init; }

        public string codigoDisciplina { get; set; }
    }
}
