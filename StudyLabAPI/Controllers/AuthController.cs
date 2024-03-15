using FluentValidation;
using FluentValidation.Results;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Mapper;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Enums;
using StudyLabAPI.Repositories;
using StudyLabAPI.Services.Email;
using StudyLabAPI.Services.Email.Models;
using StudyLabAPI.Services.Email.Models.Template;
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
    private IJwtService jwtService { get; }
    private IEmailService emailService { get; }
    private IHashService hashService { get; }
    private IValidator<RegisterUserRequestModel> registerUserRequestModelValidator { get; }
    private IValidator<UserLoginRequestModel> userLoginRequestModelValidator { get; }
    private IValidator<ConfirmUserEmailRequestModel> confirmUserEmailRequestModelValidator { get; }
    private IValidator<ResetUserPasswordRequestModel> resetUserPasswordRequestModelValidator { get; }
    private ILogger logger { get; }

    public AuthController(IUsuarioRepository usuarioRepository, ICursoRepository cursoRepository,
        ICodigoUsuarioRepository codigoUsuarioRepository, UsuarioModelMapper usuarioModelMapper,
        RegisterUserRequestModelMapper registerUserRequestModelMapper, CodigoUsuarioModelMapper codigoUsuarioModelMapper,
        ResetUserPasswordRequestModelMapper resetUserPasswordRequestModelMapper, IJwtService jwtService, IEmailService emailService, IHashService hashService, 
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
        logger.Information("Validando campos da requisição de cadastro para Username[{Username}]",
            registerUserRequestModel.username);
        ValidationResult validationResult = await registerUserRequestModelValidator
            .ValidateAsync(registerUserRequestModel);
        if(!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            logger.Error(exception, "Validation issues");
            throw exception;
        }
        
        logger.Information("Verificando se já existe um usuário com o CodigoUsuario[{CodigoUsuario}] e Email[{Email}]",
            registerUserRequestModel.username, registerUserRequestModel.email);
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
            logger.Error(exception, "Um usuário com o mesmo {NomeUsuario} ou {Email} já existe",
                nameof(registerUserRequestModel.username), nameof(registerUserRequestModel.email));
            throw exception;
        }
        
        logger.Information("Recuperando curso relacionado ao CodigoCurso[{CodigoCurso}] do usuário",
            registerUserRequestModel.codeCurso);
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
        string rawUserPassword = registerUserRequestModel.password;
        UsuarioModel usuarioModel = registerUserRequestModelMapper
            .RegisterUserRequestModelToUsuarioModel(registerUserRequestModel);
        usuarioModel.curso = relatedCurso;
        usuarioModel.statusUsuario = false;
        usuarioModel.dataCadastroUsuario = new(registerDate.Year, registerDate.Month, registerDate.Day);
        usuarioModel.senhaUsuario = hashService.Hash(rawUserPassword);
        
        logger.Information("Cadastrando usuário Username[{Username}]",
            registerUserRequestModel.username);
        await usuarioRepository.CreateUser(usuarioModel);
        await GenerateAndSendConfirmationEmail(usuarioModel);
        await usuarioRepository.Flush();
        
        logger.Information("Gerando token de autenticação para ID[{ID}]",
            usuarioModel.idUsuario);
        UserReadModel userReadModel = usuarioModelMapper.UsuarioModelToUserReadModel(usuarioModel);
        string jwtUser = jwtService.GenerateJwt(new(userReadModel.id.ToString(), userReadModel.role));
        
        logger.Information("Usuário ID[{ID}] cadastrado com sucesso",
            usuarioModel.idUsuario);
        return (userReadModel, jwtUser);
    }
    
    public async Task<(UserReadModel, string)> LoginUser(UserLoginRequestModel userLoginRequestModel)
    {
        logger.Information("Validando campos da requisição de login para Email[{UserEmail}]",
            userLoginRequestModel.email);
        ValidationResult validationResult = await userLoginRequestModelValidator
            .ValidateAsync(userLoginRequestModel);
        if(!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            logger.Error(exception, "Validation issues");
            throw exception;
        }
        
        logger.Information("Recuperando usuário com Email[{UserEmail}]",
            userLoginRequestModel.email);
        UsuarioModel? usuarioModel = await usuarioRepository
            .GetUsuarioByEmail(userLoginRequestModel.email);
        if(usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userLoginRequestModel.email), userLoginRequestModel.email);
            logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }
        
        logger.Information("Verificando senha do usuário Email[{UserEmail}]",
            userLoginRequestModel.email);
        string hashRequestUserPassword = hashService.Hash(userLoginRequestModel.password);
        if(usuarioModel.senhaUsuario != hashRequestUserPassword)
        {
            InvalidLoginPasswordException exception = new(userLoginRequestModel.email);
            logger.Error(exception, "Senha inválida");
            throw exception;
        }
        
        logger.Information("Gerando token de autenticação para ID[{ID}]",
            usuarioModel.idUsuario);
        UserReadModel userReadModel = usuarioModelMapper.UsuarioModelToUserReadModel(usuarioModel);
        string jwtUser = jwtService.GenerateJwt(new(userReadModel.id.ToString(), userReadModel.role));
        
        return (userReadModel, jwtUser);
    }
    
    public async Task<CodigoUsuarioReadModel> ConfirmUserEmail(ConfirmUserEmailRequestModel confirmUserEmailRequestModel,
        int userId)
    {
        logger.Information("Validando campos da requisição de confirmação de email para ID[{ID}]",
            userId);
        ValidationResult validationResult = await confirmUserEmailRequestModelValidator
            .ValidateAsync(confirmUserEmailRequestModel);
        if(!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            logger.Error(exception, "Validation issues");
            throw exception;
        }
        
        logger.Information("Recuperando usuário com ID[{ID}]",
            userId);
        UsuarioModel? usuarioModel = await usuarioRepository.GetUsuarioById(userId);
        if(usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userId), userId.ToString());
            logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }
        
        logger.Information("Recuperando código de confirmação de email do usuário ID[{ID}]",
            usuarioModel.idUsuario);
        CodigoUsuarioModel? confirmedUserCode = await codigoUsuarioRepository
            .GetUserCode(usuarioModel, UserCodeKind.EmailConfirmation);
        if(confirmedUserCode is null)
        {
            ConfirmationCodeNotFoundException exception = new(userId);
            logger.Error(exception, "Código de confirmação de email não encontrado");
            throw exception;
        }
        logger.Information("Validando código de confirmação ConfirmationCode[{ConfirmationCode}] de email do usuário ID[{ID}]",
            confirmUserEmailRequestModel.confirmationCode, usuarioModel.idUsuario);
        bool isEqual = confirmedUserCode.codigo == confirmUserEmailRequestModel.confirmationCode;
        if(!isEqual)
        {
            UserCodeNotMatchException exception = new(confirmUserEmailRequestModel.confirmationCode,
                UserCodeKind.EmailConfirmation);
            logger.Error(exception, "Código de confirmação de email não corresponde ao código válido");
            throw exception;
        }
        
        codigoUsuarioRepository.UseCode(confirmedUserCode);
        usuarioModel.statusUsuario = true;
        await codigoUsuarioRepository.Flush();
        CodigoUsuarioReadModel codigoUsuarioReadModel = codigoUsuarioModelMapper
            .CodigoUsuarioToCodigoUsuarioReadModel(confirmedUserCode);
        logger.Information("Email do usuário ID[{ID}] confirmado com sucesso",
            usuarioModel.idUsuario);
        
        return codigoUsuarioReadModel;
    }
    
    public async Task<ResetUserPasswordReadModel> ResetUserPassword(ResetUserPasswordRequestModel resetUserPasswordRequestModel,
        int userId)
    {
        logger.Information("Validando campos da requisição de recuperação de senha para ID[{ID}]",
            userId);
        ValidationResult validationResult = await resetUserPasswordRequestModelValidator
            .ValidateAsync(resetUserPasswordRequestModel);
        if(!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            logger.Error(exception, "Validation issues");
            throw exception;
        }
        
        logger.Information("Recuperando usuário com ID[{ID}]",
            userId);
        UsuarioModel? usuarioModel = await usuarioRepository
            .GetUsuarioById(userId);
        if(usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userId), userId.ToString());
            logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }
        
        logger.Information("Recuperando código de recuperação de senha do usuário ID[{ID}]",
            usuarioModel.idUsuario);
        CodigoUsuarioModel? resetCode = await codigoUsuarioRepository
            .GetUserCode(usuarioModel, UserCodeKind.PasswordReset);
        if(resetCode is null)
        {
            ResetPasswordCodeNotFoundException exception = new(userId);
            logger.Error(exception, "Código de recuperação de senha não encontrado");
            throw exception;
        }
        logger.Information("Verificando código de recuperação de senha ResetCode[{ResetCode}] do usuário ID[{ID}]",
            resetUserPasswordRequestModel.resetCode, usuarioModel.idUsuario);
        bool isCodeEqual = resetCode.codigo == resetUserPasswordRequestModel.resetCode;
        if(!isCodeEqual)
        {
            UserCodeNotMatchException exception = new(resetUserPasswordRequestModel.resetCode,
                UserCodeKind.PasswordReset);
            logger.Error(exception, "Código de recuperação de senha não corresponde ao código válido");
            throw exception;
        }
        
        codigoUsuarioRepository.UseCode(resetCode);
        string newPassword = hashService.Hash(resetUserPasswordRequestModel.newPassword);
        usuarioModel.senhaUsuario = newPassword;
        await codigoUsuarioRepository.Flush();
        
        logger.Information("Senha do usuário ID[{ID}] alterada com sucesso",
            usuarioModel.idUsuario);
        ResetUserPasswordReadModel resetUserPasswordReadModel = resetUserPasswordRequestModelMapper
            .ResetUserPasswordRequestModelToResetUserPasswordReadModel(resetUserPasswordRequestModel);
        return resetUserPasswordReadModel;
    }
    
    public async Task<bool> RequestConfirmationCode(int userId)
    {
        logger.Information("Recuperando usuário com ID[{ID}]",
            userId);
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
        logger.Information("Recuperando usuário com ID[{ID}]",
            userId);
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
        logger.Information("Gerando código de recuperação de senha para usuário Email[{UserEmail}]",
            usuarioModel.emailUsuario);
        CodigoUsuarioModel resetCode = await codigoUsuarioRepository
            .GenerateAndEnsureCode(usuarioModel, UserCodeKind.PasswordReset);
        bool emailSended = await SendResetPasswordEmail(usuarioModel, resetCode);
        
        if(emailSended)
        {
            logger.Information("Email de recuperação de senha enviado com sucesso para usuário Email[{UserEmail}]",
                usuarioModel.emailUsuario);
        }
        else
        {
            logger.Warning("Não foi possível enviar o email de recuperação de senha para o usuário Email[{UserEmail}]",
                usuarioModel.emailUsuario);
        }
        return emailSended;
    }
    
    private async Task<bool> GenerateAndSendConfirmationEmail(UsuarioModel usuarioModel)
    {
        logger.Information("Gerando código de confirmação de email para usuário Email[{UserEmail}]",
            usuarioModel.emailUsuario);
        CodigoUsuarioModel confirmCode = await codigoUsuarioRepository
            .GenerateAndEnsureCode(usuarioModel, UserCodeKind.EmailConfirmation);
        logger.Information("Enviando email de confirmação para usuário Email[{UserEmail}]",
            usuarioModel.emailUsuario);
        bool emailSended = await SendRegisterEmail(usuarioModel, confirmCode);
        
        if(emailSended)
        {
           logger.Information("Email de confirmação enviado com sucesso para usuário Email[{UserEmail}]",
                usuarioModel.emailUsuario); 
        }
        else
        {
            logger.Warning("Não foi possível enviar o email de boas vindas para o usuário Email[{UserEmail}]",
                usuarioModel.emailUsuario);
        }
        return emailSended;
    }
    async private Task<bool> SendRegisterEmail(UsuarioModel usuario, CodigoUsuarioModel confirmCode)
    {
        EmailIntent emailIntent = new()
        {
            toEmail = usuario.emailUsuario,
            subject = "Bem vindo ao StudyLab",
            template = new VerificationCodeEmailTemplate
            {
                username = usuario.nomeUsuario,
                verificationCode = confirmCode.codigo
            }
        };
        
        try
        {
            await emailService.SendEmail(emailIntent);
        }
        catch(Exception) { return false; }
        return true;
    }
    
    async private Task<bool> SendResetPasswordEmail(UsuarioModel usuario, CodigoUsuarioModel resetCode)
    {
        EmailIntent emailIntent = new()
        {
            toEmail = usuario.emailUsuario,
            subject = "Redefinição de senha",
            template = new ResetPasswordEmailTemplate
            {
                username = usuario.nomeUsuario,
                resetPasswordCode = resetCode.codigo
            }
        };

        try
        { 
            await emailService.SendEmail(emailIntent);
        }
        catch (Exception) { return false; }
        return true;
    }
}