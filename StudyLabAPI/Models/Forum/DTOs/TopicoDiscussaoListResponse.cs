namespace StudyLabAPI.Models.Forum.DTOs
{
    public class TopicoDiscussaoListResponse
    {
        public int maxPage { get; init; }
        public int topicoCount { get; init; }
        public int pageCount { get; init; }
        public required IReadOnlyList<TopicoDiscussaoReadModel> topicos { get; init; }
    }
}
