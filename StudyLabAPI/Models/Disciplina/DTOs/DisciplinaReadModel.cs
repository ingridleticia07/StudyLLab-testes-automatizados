using StudyLabAPI.Models.Curso;
using StudyLabAPI.Models.User;

namespace StudyLabAPI.Models.Disciplina.DTOs
{
    public record DisciplinaReadModel
    {
        public int idDisciplina { get; init; }

        public string nomeDisciplina { get; init; }

        public string professorDisciplina { get; init; }

        public CursoModel curso { get; init; }

        public UsuarioModel professor { get; init; }

        public int ?quantidadeAluno { get; init; }
        public string codigoDisciplina { get; init; }
    }
}
