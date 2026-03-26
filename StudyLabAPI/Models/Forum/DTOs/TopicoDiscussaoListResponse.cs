namespace StudyLabAPI.Models.Forum.DTOs
{
    public record TopicoDiscussaoListResponse
    {
        public int maxPage { get; init; }
        public int topicoCount { get; init; }
        public int pageCount { get; init; }
        public required IReadOnlyList<TopicoDiscussaoReadModel> topicos { get; init; }
    }
}
