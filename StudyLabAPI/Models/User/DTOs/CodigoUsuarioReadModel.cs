using StudyLabAPI.Models.Auth.Enums;

namespace StudyLabAPI.Models.User.DTOs;

public record CodigoUsuarioReadModel
{
    public required string code { get; init; }
    public required UserCodeKind codeKind { get; init; }
}