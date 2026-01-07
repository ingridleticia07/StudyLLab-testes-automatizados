using StudyLabAPI.Models.Curso.DTOs;
using StudyLabAPI.Models.User.Enums;

namespace StudyLabAPI.Models.User.DTOs;

public class UserReadModel
{
    public required int id { get; init; }
    public required string username { get; init; }
    public required string email { get; init; }
    public required UserRole role { get; init; }
    public required bool active { get; init; }
    public required CursoReadModel curso { get; init; }
    public string? imagem { get; init; }
    public string? matricula { get; init; }
}