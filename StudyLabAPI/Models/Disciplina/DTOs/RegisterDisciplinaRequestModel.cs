namespace StudyLabAPI.Models.Disciplina.DTOs
{
    public record RegisterDisciplinaRequestModel
    {
        public int idDisciplina { get; init; }
        public string nomeDisciplina { get; init; }

        public string professorDisciplina { get; init; }

        public int curso { get; init; }

        public int? quantidadeAluno { get; init; }

        public string? codigoDisciplina { get; init; }
    }
}
