namespace StudyLabAPI.Models.Forum.DTOs
{
    public record ResgisteredForumModel
    {
        public int idForum { get; init; }

        public int respostaForum { get; init; }

        public int topicoDiscussao { get; init; }

        public int usuario { get; init; }
    }
}
