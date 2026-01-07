namespace StudyLabAPI.Models.Material.DTOs
{
    public record DenunciaListResponse
    {
        public int maxPage { get; init; }
        public int denunciaCount { get; init; }
        public int pageCount { get; init; }
        public required IReadOnlyList<DenunciaReadModel> denuncias { get; init; }
    }
}
