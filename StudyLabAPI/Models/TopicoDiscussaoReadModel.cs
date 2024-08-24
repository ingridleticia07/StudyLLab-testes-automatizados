namespace StudyLabAPI.Models
{
    public class TopicoDiscussaoReadModel
    {
        public int idTopico { get; set; }

        public string nomeTopico { get; set; }

        public DateOnly dataTopico { get; set; }

        public DisciplinaModel disciplina { get; set; }
    }
}
