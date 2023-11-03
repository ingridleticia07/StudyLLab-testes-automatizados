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
    private ResetUserPasswordRequestModelMapper resetUserPasswordRequestModelMapper { get; }
    private JwtService jwtService { get; }
    private EmailService emailService { get; }
    private ArgonHashService hashService { get; }
    private IValidator<RegisterUserRequestModel> registerUserRequestModelValidator { get; }
    private IValidator<UserLoginRequestModel> userLoginRequestModelValidator { get; }
    private IValidator<ConfirmUserEmailRequestModel> confirmUserEmailRequestModelValidator { get; }
    private IValidator<ResetUserPasswordRequestModel> resetUserPasswordRequestModelValidator { get; }
    private ILogger logger { get; }

    public AuthController(IUsuarioRepository usuarioRepository, ICursoRepository cursoRepository,
        ICodigoUsuarioRepository codigoUsuarioRepository, UsuarioModelMapper usuarioModelMapper,
        RegisterUserRequestModelMapper registerUserRequestModelMapper, CodigoUsuarioModelMapper codigoUsuarioModelMapper,
        ResetUserPasswordRequestModelMapper resetUserPasswordRequestModelMapper, JwtService jwtService, EmailService emailService, ArgonHashService hashService, 
        IValidator<RegisterUserRequestModel> registerUserRequestModelValidator, IValidator<UserLoginRequestModel> userLoginRequestModelValidator, 
        IValidator<ResetUserPasswordRequestModel> resetUserPasswordRequestModelValidator, IValidator<ConfirmUserEmailRequestModel> confirmUserEmailRequestModelValidator, 
        ILogger logger)
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
        this.resetUserPasswordRequestModelValidator = resetUserPasswordRequestModelValidator;
        this.codigoUsuarioModelMapper = codigoUsuarioModelMapper;
        this.logger = logger;
        this.resetUserPasswordRequestModelMapper = resetUserPasswordRequestModelMapper;
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
        
        await GenerateAndSendConfirmationEmail(usuarioModel);
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
    
    public async Task<ResetUserPasswordReadModel> ResetUserPassword(ResetUserPasswordRequestModel resetUserPasswordRequestModel,
        int userId)
    {
        ValidationResult validationResult = await resetUserPasswordRequestModelValidator
            .ValidateAsync(resetUserPasswordRequestModel);
        if(!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            logger.Error(exception, "Validation issues");
            throw exception;
        }
        
        UsuarioModel? usuarioModel = await usuarioRepository
            .GetUsuarioById(userId);
        if(usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userId), userId.ToString());
            logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }
        
        CodigoUsuarioModel? resetCode = await codigoUsuarioRepository
            .GetUserCode(usuarioModel, UserCodeKind.PasswordReset);
        if(resetCode is null)
        {
            ResetPasswordCodeNotFoundException exception = new(userId);
            logger.Error(exception, "Código de recuperação de senha não encontrado");
            throw exception;
        }
        
        bool isCodeEqual = resetCode.codigo == resetUserPasswordRequestModel.resetCode;
        if(!isCodeEqual)
        {
            UserCodeNotMatchException exception = new(resetUserPasswordRequestModel.resetCode,
                UserCodeKind.PasswordReset);
            logger.Error(exception, "Código de recuperação de senha não corresponde ao código válido");
            throw exception;
        }
        string currentPasswordHash = hashService.Hash(resetUserPasswordRequestModel.currentPassword);
        bool currentPassword = currentPasswordHash == usuarioModel.senhaUsuario;
        if(!currentPassword)
        {
            CurrentPasswordNotMatchException exception = new(resetUserPasswordRequestModel.currentPassword);
            logger.Error(exception, "Senha atual não corresponde à senha do usuário");
            throw exception;
        }
        
        codigoUsuarioRepository.UseCode(usuarioModel, resetCode);
        string newPassword = hashService.Hash(resetUserPasswordRequestModel.newPassword);
        usuarioModel.senhaUsuario = newPassword;
        await codigoUsuarioRepository.Flush();
        
        ResetUserPasswordReadModel resetUserPasswordReadModel = resetUserPasswordRequestModelMapper
            .ResetUserPasswordRequestModelToResetUserPasswordReadModel(resetUserPasswordRequestModel);
        return resetUserPasswordReadModel;
    }
    
    public async Task<bool> RequestConfirmationCode(int userId)
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
        
        bool emailSended = await GenerateAndSendConfirmationEmail(usuarioModel);
        await codigoUsuarioRepository.Flush();
        return emailSended;
    }
    
    public async Task<bool> RequestPasswordResetCode(int userId)
    {
        UsuarioModel? usuarioModel = await usuarioRepository.GetUsuarioById(userId);
        if(usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userId), userId.ToString());
            logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }
        
        bool emailSended = await GenerateAndSendResetUserPassword(usuarioModel);
        await codigoUsuarioRepository.Flush();
        return emailSended;
    }
    
    private async Task<bool> GenerateAndSendResetUserPassword(UsuarioModel usuarioModel)
    {
        CodigoUsuarioModel resetCode = await codigoUsuarioRepository
            .GenerateAndEnsureCode(usuarioModel, UserCodeKind.PasswordReset);
        bool emailSended = await SendResetPasswordEmail(usuarioModel, resetCode);
        
        if(!emailSended)
        {
            logger.Warning("Não foi possível enviar o email de recuperação de senha para o usuário Email[{UserEmail}]",
                usuarioModel.emailUsuario);
        }
        
        return emailSended;
    }
    
    private async Task<bool> GenerateAndSendConfirmationEmail(UsuarioModel usuarioModel)
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
    
    private async Task<bool> SendResetPasswordEmail(UsuarioModel usuario, CodigoUsuarioModel resetCode)
    {
        EmailIntent emailIntent = new()
        {
            toEmail = usuario.emailUsuario,
            subject = "Redefinição de senha",
            message = $"""
                        Olá {usuario.nomeUsuario}, você solicitou uma redefinição de senha.
                        Aqui está seu codigo de redefinição de senha: {resetCode.codigo}.
                        
                        Se você não solicitou uma redefinição de senha, ignore este email.
                       """
        };

        try
        { 
            await emailService.SendEmail(emailIntent);
        }
        catch (Exception) { return false; }
        return true;
    }
}