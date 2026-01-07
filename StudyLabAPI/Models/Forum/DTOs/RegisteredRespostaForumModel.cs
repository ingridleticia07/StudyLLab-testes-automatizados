namespace StudyLabAPI.Models.Forum.DTOs
{
    public record RegisteredRespostaForumModel
    {
        public int idResposta { get; init; }

        public string resposta { get; init; }

        public DateOnly dataResposta { get; init; }

        public int topicoDiscussao { get; init; }

        public int usuario { get; init; }
    }
}
