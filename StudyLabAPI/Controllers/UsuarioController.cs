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
            username = user.nomeUsuario,
            email = user.emailUsuario,
            active = user.statusUsuario,
            role = user.tipoUsuario,
            curso = new(user.curso.nomeCurso)
        };
    }
}