namespace StudyLabAPI.Models;

public class ResetUserPasswordRequestModel
{
    public string newPassword { get; set; }
    public string resetCode { get; set; }
}