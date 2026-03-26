using StudyLabAPI.Models.User.Enums;

namespace StudyLabAPI.Models.User.DTOs;

public record RegisterUserRequestModel
{
    public string username { get; init; } = null!;
    public string email { get; init; } = null!;
    public string password { get; init; } = null!;
    public string matricula { get; init; } = null!;
    public UserRole role { get; init; }
    public int codeCurso { get; init; }
    public string? imagem { get; init; }
}