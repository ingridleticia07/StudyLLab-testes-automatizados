namespace StudyLabAPI.Models
{
    public class DocumentoListResponse
    {
        public int maxPage { get; init; }
        public int documentoForumCount { get; init; }
        public int pageCount { get; init; }
        public required IReadOnlyList<DocumentoReadModel> documentos { get; init; }
    }
}
