using StudyLabAPI.Exceptions;
using StudyLabAPI.Models;
using StudyLabAPI.Repositories;
using ILogger = Serilog.ILogger;

namespace StudyLabAPI.Controllers;

/// <summary>
/// Implementação genérica de <see cref="IUsuarioController"/>.
/// </summary>
public class UsuarioController : IUsuarioController
{
    private IUsuarioRepository userRepository { get; }
    private ILogger logger { get; }

    public UsuarioController(IUsuarioRepository userRepository, ILogger logger)
    {
        this.userRepository = userRepository;
        this.logger = logger;
    }
    
    public async Task<UserReadModel> GetUserInfoById(int id)
    {
        UsuarioModel? user = await userRepository.GetUsuarioById(id);
        if (user is null)
        {
            UsuarioNotFoundException usuarioNotFoundException = new(nameof(id), id.ToString());
            logger.Error(usuarioNotFoundException, "Usuario não encontrado");
            throw usuarioNotFoundException;
        }
        
        return new()
        {
            id = user.idUsuario,
            username = user.nomeUsuario,
            email = user.emailUsuario,
            active = user.statusUsuario,
            role = user.tipoUsuario,
            curso = new(user.curso.nomeCurso)
        };
    }
}