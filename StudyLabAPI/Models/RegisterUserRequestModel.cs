namespace StudyLabAPI.Models;

public class RegisterUserRequestModel
{
    public string username { get; set; }
    public string email { get; set; }
    public string password { get; set; }
    public string confirmPassword { get; set; }
}