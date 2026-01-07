namespace StudyLabAPI.Models.User.DTOs;

public record ResetUserPasswordRequestModel
{
    public string userEmail { get; init; }
    public string newPassword { get; init; }
    public string resetCode { get; init; }
}