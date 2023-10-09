using StudyLabAPI.Models.Enums;

namespace StudyLabAPI.Models;

public class RegisterUserRequestModel
{
    public string username { get; set; } = null!;
    public string email { get; set; } = null!;
    public string password { get; set; } = null!;
    public UserRole role { get; set; }
    public int codeCurso { get; set; }
}