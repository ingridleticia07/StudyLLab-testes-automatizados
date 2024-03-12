namespace StudyLabAPI.Models
{
    public class DisciplinaReadModel
    {
        public int idDisciplina { get; set; }

        public string nomeDisciplina { get; set; }

        public string professorDisciplina { get; set; }

        public CursoModel curso { get; init; }

        public int ?quantidadeAluno { get; set; }
        public string codigoDisciplina { get; set; }
    }
}
