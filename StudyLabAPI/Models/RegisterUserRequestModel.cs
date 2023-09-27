using StudyLabAPI.Models.Enum;

namespace StudyLabAPI.Models;

public class RegisterUserRequestModel
{
    public string username { get; set; } = null!;
    public string email { get; set; } = null!;
    public string password { get; set; } = null!;
    public int role { get; set; }
    public CursoCode codeCurso { get; set; }
}