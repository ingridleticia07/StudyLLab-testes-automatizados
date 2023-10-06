using StudyLabAPI.Models;

namespace StudyLabAPI.Controllers;

public interface IUsuarioController
{
    public Task<UserReadModel?> GetUserInfoById(int id);
}