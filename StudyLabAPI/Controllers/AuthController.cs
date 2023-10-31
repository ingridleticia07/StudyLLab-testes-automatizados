using FluentValidation;
using FluentValidation.Results;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Mapper;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Enums;
using StudyLabAPI.Repositories;
using StudyLabAPI.Services.Email;
using StudyLabAPI.Services.Email.Models;
using StudyLabAPI.Services.Hash;
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
    private ICodigoUsuarioRepository codigoUsuarioRepository { get; }
    private UsuarioModelMapper usuarioModelMapper { get; }
    private RegisterUserRequestModelMapper registerUserRequestModelMapper { get; }
    private CodigoUsuarioModelMapper codigoUsuarioModelMapper { get; }
    private JwtService jwtService { get; }
    private EmailService emailService { get; }
    private ArgonHashService hashService { get; }
    private IValidator<RegisterUserRequestModel> registerUserRequestModelValidator { get; }
    private IValidator<UserLoginRequestModel> userLoginRequestModelValidator { get; }
    private IValidator<ConfirmUserEmailRequestModel> confirmUserEmailRequestModelValidator { get; }
    private ILogger logger { get; }

    public AuthController(IUsuarioRepository usuarioRepository, ICursoRepository cursoRepository,
        ICodigoUsuarioRepository codigoUsuarioRepository, UsuarioModelMapper usuarioModelMapper,
        RegisterUserRequestModelMapper registerUserRequestModelMapper, CodigoUsuarioModelMapper codigoUsuarioModelMapper,
        JwtService jwtService, EmailService emailService, ArgonHashService hashService, 
        IValidator<RegisterUserRequestModel> registerUserRequestModelValidator, IValidator<UserLoginRequestModel> userLoginRequestModelValidator, 
        IValidator<ConfirmUserEmailRequestModel> confirmUserEmailRequestModelValidator, ILogger logger)
    {
        this.usuarioRepository = usuarioRepository;
        this.cursoRepository = cursoRepository;
        this.codigoUsuarioRepository = codigoUsuarioRepository;
        this.usuarioModelMapper = usuarioModelMapper;
        this.registerUserRequestModelMapper = registerUserRequestModelMapper;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.hashService = hashService;
        this.registerUserRequestModelValidator = registerUserRequestModelValidator;
        this.userLoginRequestModelValidator = userLoginRequestModelValidator;
        this.confirmUserEmailRequestModelValidator = confirmUserEmailRequestModelValidator;
        this.codigoUsuarioModelMapper = codigoUsuarioModelMapper;
        this.logger = logger;
    }
    
    public async Task<CodigoUsuarioReadModel> ConfirmUserEmail(ConfirmUserEmailRequestModel confirmUserEmailRequestModel,
        int userId)
    {
        ValidationResult validationResult = await confirmUserEmailRequestModelValidator
            .ValidateAsync(confirmUserEmailRequestModel);
        if(!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            logger.Error(exception, "Validation issues");
            throw exception;
        }
        
        UsuarioModel? usuarioModel = await usuarioRepository.GetUsuarioById(userId);
        if(usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userId), userId.ToString());
            logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }
        
        CodigoUsuarioModel? confirmedUserCode = await codigoUsuarioRepository
            .GetUserCode(usuarioModel, UserCodeKind.EmailConfirmation);
        if(confirmedUserCode is null)
        {
            ConfirmationCodeNotFoundException exception = new(userId);
            logger.Error(exception, "Código de confirmação de email não encontrado");
            throw exception;
        }
        bool isEqual = confirmedUserCode.codigo == confirmUserEmailRequestModel.confirmationCode;
        if(!isEqual)
        {
            UserCodeNotMatchException exception = new(confirmUserEmailRequestModel.confirmationCode,
                UserCodeKind.EmailConfirmation);
            logger.Error(exception, "Código de confirmação de email não corresponde ao código válido");
            throw exception;
        }
        
        codigoUsuarioRepository.UseCode(usuarioModel, confirmedUserCode);
        usuarioModel.statusUsuario = true;
        await codigoUsuarioRepository.Flush();
        CodigoUsuarioReadModel codigoUsuarioReadModel = codigoUsuarioModelMapper
            .CodigoUsuarioToCodigoUsuarioReadModel(confirmedUserCode);
        
        return codigoUsuarioReadModel;
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
            logger.Error(exception, "Curso not found");
            throw exception;
        }
        
        DateTime registerDate = DateTime.Now.Date;
        string rawUserPassword = registerUserRequestModel.password;
        UsuarioModel usuarioModel = registerUserRequestModelMapper
            .RegisterUserRequestModelToUsuarioModel(registerUserRequestModel);
        usuarioModel.curso = relatedCurso;
        usuarioModel.statusUsuario = false;
        usuarioModel.dataCadastroUsuario = new(registerDate.Year, registerDate.Month, registerDate.Day);
        usuarioModel.senhaUsuario = hashService.Hash(rawUserPassword);
        
        await usuarioRepository.CreateUser(usuarioModel);
        
        await SendConfirmationEmail(usuarioModel);
        await usuarioRepository.Flush();
        
        UserReadModel userReadModel = usuarioModelMapper.UsuarioModelToUserReadModel(usuarioModel);
        string jwtUser = jwtService.GenerateJwt(new(userReadModel.id.ToString(), userReadModel.role));
        
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
        
        string hashRequestUserPassword = hashService.Hash(userLoginRequestModel.password);
        if(usuarioModel.senhaUsuario != hashRequestUserPassword)
        {
            InvalidLoginPasswordException exception = new(userLoginRequestModel.email);
            logger.Error(exception, "Senha inválida");
            throw exception;
        }
        
        UserReadModel userReadModel = usuarioModelMapper.UsuarioModelToUserReadModel(usuarioModel);
        string jwtUser = jwtService.GenerateJwt(new(userReadModel.id.ToString(), userReadModel.role));
        
        return (userReadModel, jwtUser);
    }
    public async Task<bool> SendConfirmationEmail(int userId)
    {
        UsuarioModel? usuarioModel = await usuarioRepository.GetUsuarioById(userId);
        if(usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userId), userId.ToString());
            logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }
        if(usuarioModel.statusUsuario)
        {
            logger.Warning("Este usuário já está com Email[{UserEmail}] confirmado",
                usuarioModel.emailUsuario);
        }
        
        bool emailSended = await SendConfirmationEmail(usuarioModel);
        await codigoUsuarioRepository.Flush();
        return emailSended;
    }
    
    private async Task<bool> SendConfirmationEmail(UsuarioModel usuarioModel)
    {
        CodigoUsuarioModel confirmCode = await codigoUsuarioRepository
            .GenerateAndEnsureCode(usuarioModel, UserCodeKind.EmailConfirmation);
        bool emailSended = await SendRegisterEmail(usuarioModel, confirmCode);
        
        if(!emailSended)
        {
            logger.Warning("Não foi possível enviar o email de boas vindas para o usuário Email[{UserEmail}]",
                usuarioModel.emailUsuario);
        }
        return emailSended;
    }
    private async Task<bool> SendRegisterEmail(UsuarioModel usuario, CodigoUsuarioModel confirmCode)
    {
        EmailIntent emailIntent = new()
        {
            toEmail = usuario.emailUsuario,
            subject = "Bem vindo ao StudyLab",
            message = $"""
                        Olá {usuario.nomeUsuario}, seja bem vindo ao StudyLab.
                        Aqui está seu codigo de confirmação de email: {confirmCode.codigo}
                       """
        };
        
        try
        {
            await emailService.SendEmail(emailIntent);
        }
        catch(Exception) { return false; }
        return true;
    }
}