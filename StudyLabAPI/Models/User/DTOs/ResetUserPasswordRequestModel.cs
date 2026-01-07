namespace StudyLabAPI.Models.User.DTOs;

public class ResetUserPasswordRequestModel
{
    public string userEmail { get; set; }
    public string newPassword { get; set; }
    public string resetCode { get; set; }
}