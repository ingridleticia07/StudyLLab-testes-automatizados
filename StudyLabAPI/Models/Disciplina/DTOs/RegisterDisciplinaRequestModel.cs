namespace StudyLabAPI.Models.Disciplina.DTOs
{
    public class RegisterDisciplinaRequestModel
    {
        public int idDisciplina { get; set; }
        public string nomeDisciplina { get; set; }

        public string professorDisciplina { get; set; }

        public int curso { get; set; }

        public int? quantidadeAluno { get; set; }

        public string? codigoDisciplina { get; set; }
    }
}
