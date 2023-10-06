using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories;

public interface IUsuarioRepository
{
    public Task<UsuarioModel?> GetUsuarioById(int id);
}