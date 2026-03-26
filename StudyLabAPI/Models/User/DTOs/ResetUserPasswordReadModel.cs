namespace StudyLabAPI.Models.User.DTOs;

public record ResetUserPasswordReadModel
{
    public required string newPassword { get; init; }
    public required string resetCode { get; init; }
}