using StudyLabAPI.Models.Disciplina;
using StudyLabAPI.Models.User;

namespace StudyLabAPI.Models.Forum.DTOs
{
    public class TopicoDiscussaoReadModel
    {
        public int idTopico { get; set; }

        public string nomeTopico { get; set; }

        public DateOnly dataTopico { get; set; }

        public DisciplinaModel disciplina { get; set; }

        public UsuarioModel usuario { get; set; }
    }
}
