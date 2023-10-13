using StudyLabAPI.Exceptions;
using StudyLabAPI.Models;
using StudyLabAPI.Repositories;
using ILogger = Serilog.ILogger;

namespace StudyLabAPI.Controllers;

public class AuthController : IAuthController
{
    private IUsuarioRepository usuarioRepository { get; }
    private ICursoRepository cursoRepository { get; }
    private ILogger logger { get; }

    public AuthController(IUsuarioRepository usuarioRepository, ICursoRepository cursoRepository, 
        ILogger logger)
    {
        this.usuarioRepository = usuarioRepository;
        this.cursoRepository = cursoRepository;
        this.logger = logger;
    }
    
    public async Task<UserReadModel> RegisterNewUser(RegisterUserRequestModel registerUserRequestModel)
    {
        //TODO: Validation
        
        int cursoId = registerUserRequestModel.codeCurso;
        CursoModel? relatedCurso = await cursoRepository
            .GetCursoById(cursoId);
        if(relatedCurso is null)
        {
            CursoNotFound exception = new(cursoId);
            logger.Error(exception, "Curso não encontrado");
            throw exception;
        }
        
        DateTime registerDate = DateTime.Now.Date;
        UsuarioModel usuarioModel = new()
        {
            nomeUsuario = registerUserRequestModel.username,
            emailUsuario = registerUserRequestModel.email,
            senhaUsuario = registerUserRequestModel.password,
            tipoUsuario = registerUserRequestModel.role,
            curso = relatedCurso,
            statusUsuario = true,
            dataCadastroUsuario = new(registerDate.Year, registerDate.Month, registerDate.Day),
        };
        await usuarioRepository.CreateUser(usuarioModel);
        await usuarioRepository.Flush();
        
        return new()
        {
            id = usuarioModel.idUsuario,
            username = usuarioModel.nomeUsuario,
            email = usuarioModel.emailUsuario,
            role = usuarioModel.tipoUsuario,
            active = usuarioModel.statusUsuario,
            curso = new(relatedCurso.nomeCurso)
        };
    }
    
    public async Task<UserReadModel> LoginUser(UserLoginRequestModel userLoginRequestModel)
    {
        //TODO: Validation
        
        UsuarioModel? usuarioModel = await usuarioRepository
            .GetUsuarioByEmail(userLoginRequestModel.email);
        
        if(usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(userLoginRequestModel.email);
            logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }
        if(usuarioModel.senhaUsuario != userLoginRequestModel.password)
        {
            InvalidLoginPasswordException exception = new(userLoginRequestModel.email);
            logger.Error(exception, "Senha inválida");
            throw exception;
        }
        
        return new()
        {
            id = usuarioModel.idUsuario,
            username = usuarioModel.nomeUsuario,
            email = usuarioModel.emailUsuario,
            role = usuarioModel.tipoUsuario,
            active = usuarioModel.statusUsuario,
            curso = new(usuarioModel.curso.nomeCurso)
        };
    }
}