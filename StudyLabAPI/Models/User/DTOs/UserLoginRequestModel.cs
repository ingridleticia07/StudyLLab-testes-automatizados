namespace StudyLabAPI.Models.User.DTOs;

public class UserLoginRequestModel
{
    public string email { get; set; } = null!;
    public string password { get; set; } = null!;
}