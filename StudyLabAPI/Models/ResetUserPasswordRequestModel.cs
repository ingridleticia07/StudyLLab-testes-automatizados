namespace StudyLabAPI.Models;

public class ResetUserPasswordRequestModel
{
    public string currentPassword { get; set; }
    public string newPassword { get; set; }
    public string resetCode { get; set; }
}