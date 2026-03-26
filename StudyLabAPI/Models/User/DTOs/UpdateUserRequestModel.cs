using StudyLabAPI.Models.User.Enums;

namespace StudyLabAPI.Models.User.DTOs;

public record UpdateUserRequestModel
{
    public string? username { get; init; }
    public string? password { get; init; }
    public UserRole? role { get; init; }
    public bool? active { get; init; }
    public int? codeCurso { get; init; }
    public string? imagem { get; init; }
}