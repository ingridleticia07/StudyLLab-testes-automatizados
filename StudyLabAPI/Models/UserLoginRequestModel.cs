namespace StudyLabAPI.Models;

public class UserLoginRequestModel
{
    public string username { get; set; } = null!;
    public string password { get; set; } = null!;
}