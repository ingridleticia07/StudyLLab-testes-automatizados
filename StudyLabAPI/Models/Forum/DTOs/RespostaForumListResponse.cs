namespace StudyLabAPI.Models.Forum.DTOs
{
    public class RespostaForumListResponse
    {
        public int maxPage { get; init; }
        public int respostaForumCount { get; init; }
        public int pageCount { get; init; }
        public required IReadOnlyList<RespostaForumReadModel> respostasForum { get; init; }
    }
}
