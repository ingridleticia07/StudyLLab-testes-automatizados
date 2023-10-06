using StudyLabAPI.Models;
using StudyLabAPI.Repositories;

namespace StudyLabAPI.Controllers;

public class UsuarioController : IUsuarioController
{
    private IUsuarioRepository userRepository { get; }

    public UsuarioController(IUsuarioRepository userRepository)
    {
        this.userRepository = userRepository;
    }
    
    public async Task<UserReadModel?> GetUserInfoById(int id)
    {
        UsuarioModel? user = await userRepository.GetUsuarioById(id);
        if (user == null) return null;
        
        return new()
        {
            username = user.nome_usuario,
            email = user.email_usuario,
            active = user.status_usuario,
            role = user.tipo_usuario,
            curso = new(user.curso.nome_curso)
        };
    }
}