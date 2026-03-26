namespace StudyLabAPI.Models.Forum.DTOs
{
    public record RespostaForumListResponse
    {
        public int maxPage { get; init; }
        public int respostaForumCount { get; init; }
        public int pageCount { get; init; }
        public required IReadOnlyList<RespostaForumReadModel> respostasForum { get; init; }
    }
}
