namespace StudyLabAPI.Models;

public class UserLoginRequestModel
{
    public string email { get; set; } = null!;
    public string password { get; set; } = null!;
}