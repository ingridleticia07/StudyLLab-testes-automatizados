namespace StudyLabAPI.Models.User.DTOs;

public record RequestResetPasswordEmailRequestModel
{
    public string userEmail { get; init; }
}