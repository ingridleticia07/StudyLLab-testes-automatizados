namespace StudyLabAPI.Models;

public class UserReadModel
{
    public required string? username { get; init; }
    public required string email { get; init; }
    public required int role { get; set; }
    public required bool active { get; set; }
    public required CursoReadModel curso { get; init; }
}