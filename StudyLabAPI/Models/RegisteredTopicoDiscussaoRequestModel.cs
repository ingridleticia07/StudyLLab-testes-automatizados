namespace StudyLabAPI.Models
{
    public class RegisteredTopicoDiscussaoRequestModel
    {
        public int idTopico { get; set; }

        public string nomeTopico { get; set; }
        public DateOnly dataTopico { get; set; }
        public int disciplina { get; set; }
    }
}
