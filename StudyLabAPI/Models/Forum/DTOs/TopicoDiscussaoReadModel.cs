using StudyLabAPI.Models.Disciplina;
using StudyLabAPI.Models.User;

namespace StudyLabAPI.Models.Forum.DTOs
{
    public record TopicoDiscussaoReadModel
    {
        public int idTopico { get; init; }

        public string nomeTopico { get; init; }

        public DateOnly dataTopico { get; init; }

        public DisciplinaModel disciplina { get; init; }

        public UsuarioModel usuario { get; init; }
    }
}
