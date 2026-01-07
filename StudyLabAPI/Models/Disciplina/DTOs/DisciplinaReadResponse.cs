namespace StudyLabAPI.Models.Disciplina.DTOs
{
    public class DisciplinaListResponse
    {
        public int maxPage { get; init; }
        public int disciplinaCount { get; init; }
        public int pageCount { get; init; }
        public required IReadOnlyList<DisciplinaReadModel> disciplinas { get; init; }
    }
}
