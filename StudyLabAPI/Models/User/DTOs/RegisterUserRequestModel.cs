using StudyLabAPI.Models.User.Enums;

namespace StudyLabAPI.Models.User.DTOs;

public class RegisterUserRequestModel
{
    public string username { get; set; } = null!;
    public string email { get; set; } = null!;
    public string password { get; set; } = null!;
    public string matricula { get; set; } = null!;
    public UserRole role { get; set; }
    public int codeCurso { get; set; }
    public string? imagem { get; set; }
}