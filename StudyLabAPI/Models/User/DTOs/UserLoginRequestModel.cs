namespace StudyLabAPI.Models.User.DTOs;

public record UserLoginRequestModel
{
    public string email { get; init; } = null!;
    public string password { get; init; } = null!;
}