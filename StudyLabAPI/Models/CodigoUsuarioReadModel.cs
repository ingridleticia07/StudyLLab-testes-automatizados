using StudyLabAPI.Models.Enums;

namespace StudyLabAPI.Models;

public class CodigoUsuarioReadModel
{
    public required string code { get; init; }
    public required UserCodeKind codeKind { get; init; }
}