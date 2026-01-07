namespace StudyLabAPI.Models.Forum.DTOs
{
    public record RegisteredTopicoDiscussaoRequestModel
    {
        public int idTopico { get; init; }

        public string nomeTopico { get; init; }

        public DateOnly dataTopico { get; init; }

        public int disciplina { get; init; }

        public int idUsuario { get; init; }
    }
}
