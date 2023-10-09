using StudyLabAPI.Models.Enums;

namespace StudyLabAPI.Models;

public class UserReadModel
{
    public required int id { get; init; }
    public required string? username { get; init; }
    public required string email { get; init; }
    public required UserRole role { get; init; }
    public required bool active { get; init; }
    public required CursoReadModel curso { get; init; }
}