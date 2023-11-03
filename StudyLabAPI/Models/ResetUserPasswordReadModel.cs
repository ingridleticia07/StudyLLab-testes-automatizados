namespace StudyLabAPI.Models;

public class ResetUserPasswordReadModel
{
    public required string currentPassword { get; init; }
    public required string newPassword { get; init; }
    public required string resetCode { get; init; }
}