using FluentValidation;
using FluentValidation.Results;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Mapper;
using StudyLabAPI.Models;
using StudyLabAPI.Repositories;
using StudyLabAPI.Services.Email;
using StudyLabAPI.Services.Email.Models;
using StudyLabAPI.Services.Jwt;
using ILogger = Serilog.ILogger;
using ValidationException = StudyLabAPI.Exceptions.ValidationException;

namespace StudyLabAPI.Controllers;

/// <summary>
/// Implementação genérica de <see cref="IAuthController"/>.
/// </summary>
public class AuthController : IAuthController
{
    private IUsuarioRepository usuarioRepository { get; }
    private ICursoRepository cursoRepository { get; }
    private UsuarioModelMapper usuarioModelMapper { get; }
    private JwtService jwtService { get; }
    private EmailService emailService { get; }
    private IValidator<RegisterUserRequestModel> registerUserRequestModelValidator { get; }
    private IValidator<UserLoginRequestModel> userLoginRequestModelValidator { get; }
    private ILogger logger { get; }

    public AuthController(IUsuarioRepository usuarioRepository, ICursoRepository cursoRepository, 
        UsuarioModelMapper usuarioModelMapper, JwtService jwtService, EmailService emailService, 
        IValidator<RegisterUserRequestModel> registerUserRequestModelValidator, 
        IValidator<UserLoginRequestModel> userLoginRequestModelValidator, 
        ILogger logger)
    {
        this.usuarioRepository = usuarioRepository;
        this.cursoRepository = cursoRepository;
        this.usuarioModelMapper = usuarioModelMapper;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.registerUserRequestModelValidator = registerUserRequestModelValidator;
        this.userLoginRequestModelValidator = userLoginRequestModelValidator;
        this.logger = logger;
    }
    
    public async Task<(UserReadModel, string)> RegisterNewUser(RegisterUserRequestModel registerUserRequestModel)
    {
        ValidationResult validationResult = await registerUserRequestModelValidator
            .ValidateAsync(registerUserRequestModel);
        if(!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            logger.Error(exception, "Validation issues");
            throw exception;
        }
        
        bool invalidExists = await usuarioRepository
            .CheckUserByCodigoAndEmail(registerUserRequestModel.codigoUsuario,
                registerUserRequestModel.email);
        if(invalidExists)
        {
            ExistsUserException exception = new(new List<string> 
            { 
                nameof(registerUserRequestModel.codigoUsuario), 
                nameof(registerUserRequestModel.email) 
            });
            logger.Error(exception, "The user with those informations already exist");
            throw exception;
        }
        
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
        UsuarioModel usuarioModel = usuarioModelMapper
            .RegisterUserRequestModelToUsuarioModel(registerUserRequestModel);
        usuarioModel.curso = relatedCurso;
        usuarioModel.statusUsuario = true;
        usuarioModel.dataCadastroUsuario = new(registerDate.Year, registerDate.Month, registerDate.Day);
        await usuarioRepository.CreateUser(usuarioModel);
        await usuarioRepository.Flush();
        
        UserReadModel userReadModel = new()
        {
            id = usuarioModel.idUsuario,
            username = usuarioModel.nomeUsuario,
            email = usuarioModel.emailUsuario,
            role = usuarioModel.tipoUsuario,
            active = usuarioModel.statusUsuario,
            curso = new(relatedCurso.nomeCurso)
        };
        string jwtUser = jwtService.GenerateJwt(new(userReadModel.id.ToString(), userReadModel.role));
        bool emailSended = await SendRegisterEmail(userReadModel.email, userReadModel.username);
        if(!emailSended)
            logger.Warning("Não foi possível enviar o email de boas vindas para o usuário Email[{UserEmail}]",
                userReadModel.email);
        
        return (userReadModel, jwtUser);
    }
    
    public async Task<(UserReadModel, string)> LoginUser(UserLoginRequestModel userLoginRequestModel)
    {
        ValidationResult validationResult = await userLoginRequestModelValidator
            .ValidateAsync(userLoginRequestModel);
        if(!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            logger.Error(exception, "Validation issues");
            throw exception;
        }
        
        UsuarioModel? usuarioModel = await usuarioRepository
            .GetUsuarioByEmail(userLoginRequestModel.email);
        
        if(usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userLoginRequestModel.email), userLoginRequestModel.email);
            logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }
        if(usuarioModel.senhaUsuario != userLoginRequestModel.password)
        {
            InvalidLoginPasswordException exception = new(userLoginRequestModel.email);
            logger.Error(exception, "Senha inválida");
            throw exception;
        }
        
        UserReadModel userReadModel = usuarioModelMapper.UsuarioModelToUserReadModel(usuarioModel);
        string jwtUser = jwtService.GenerateJwt(new(userReadModel.id.ToString(), userReadModel.role));
        
        return (userReadModel, jwtUser);
    }
    
    private async Task<bool> SendRegisterEmail(string toEmail, string username)
    {
        EmailIntent emailIntent = new()
        {
            toEmail = toEmail,
            subject = "Bem vindo ao StudyLab",
            message = $"Olá {username}, seja bem vindo ao StudyLab"
        };
        
        try
        {
            await emailService.SendEmail(emailIntent);
        }
        catch(Exception) { return false; }
        return true;
    }
}