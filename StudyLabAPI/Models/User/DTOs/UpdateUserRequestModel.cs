using StudyLabAPI.Models.User.Enums;

namespace StudyLabAPI.Models.User.DTOs;

public class UpdateUserRequestModel
{
    public string? username { get; set; }
    public string? password { get; set; }
    public UserRole? role { get; set; }
    public bool? active { get; set; }
    public int? codeCurso { get; set; }
    public string? imagem { get; set; }
}