using FluentValidation;
using FluentValidation.Results;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Mapper;
using StudyLabAPI.Models.Auth;
using StudyLabAPI.Models.Auth.Enums;
using StudyLabAPI.Models.Curso;
using StudyLabAPI.Models.User;
using StudyLabAPI.Models.User.DTOs;
using StudyLabAPI.Models.User.Enums;
using StudyLabAPI.Repositories;
using StudyLabAPI.Services.Email;
using StudyLabAPI.Services.Email.Models;
using StudyLabAPI.Services.Email.Models.Template;
using StudyLabAPI.Services.Hash;
using StudyLabAPI.Services.Jwt;
using StudyLabAPI.Validators;
using ILogger = Serilog.ILogger;
using ValidationException = StudyLabAPI.Exceptions.ValidationException;

namespace StudyLabAPI.Services.Application.Auth;

/// <summary>
/// Implementação genérica de <see cref="IAuthService"/>.
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly ICursoRepository _cursoRepository;
    private readonly ICodigoUsuarioRepository _codigoUsuarioRepository;
    private readonly UsuarioModelMapper _usuarioModelMapper;
    private readonly RegisterUserRequestModelMapper _registerUserRequestModelMapper;
    private readonly CodigoUsuarioModelMapper _codigoUsuarioModelMapper;
    private readonly ResetUserPasswordRequestModelMapper _resetUserPasswordRequestModelMapper;
    private readonly IJwtService _jwtService;
    private readonly IEmailService _emailService;
    private readonly IHashService _hashService;
    private readonly IValidator<RegisterUserRequestModel> _registerUserRequestModelValidator;
    private readonly IValidator<UserLoginRequestModel> _userLoginRequestModelValidator;
    private readonly IValidator<ConfirmUserEmailRequestModel> _confirmUserEmailRequestModelValidator;
    private readonly IValidator<ResetUserPasswordRequestModel> _resetUserPasswordRequestModelValidator;
    private readonly ILogger _logger;

    public AuthService(IUsuarioRepository usuarioRepository, ICursoRepository cursoRepository,
        ICodigoUsuarioRepository codigoUsuarioRepository, UsuarioModelMapper usuarioModelMapper,
        RegisterUserRequestModelMapper registerUserRequestModelMapper, CodigoUsuarioModelMapper codigoUsuarioModelMapper,
        ResetUserPasswordRequestModelMapper resetUserPasswordRequestModelMapper, IJwtService jwtService, IEmailService emailService, IHashService hashService,
        IValidator<RegisterUserRequestModel> registerUserRequestModelValidator, IValidator<UserLoginRequestModel> userLoginRequestModelValidator,
        IValidator<ResetUserPasswordRequestModel> resetUserPasswordRequestModelValidator, IValidator<ConfirmUserEmailRequestModel> confirmUserEmailRequestModelValidator,
        ILogger logger)
    {
        _usuarioRepository = usuarioRepository;
        _cursoRepository = cursoRepository;
        _codigoUsuarioRepository = codigoUsuarioRepository;
        _usuarioModelMapper = usuarioModelMapper;
        _registerUserRequestModelMapper = registerUserRequestModelMapper;
        _jwtService = jwtService;
        _emailService = emailService;
        _hashService = hashService;
        _registerUserRequestModelValidator = registerUserRequestModelValidator;
        _userLoginRequestModelValidator = userLoginRequestModelValidator;
        _confirmUserEmailRequestModelValidator = confirmUserEmailRequestModelValidator;
        _resetUserPasswordRequestModelValidator = resetUserPasswordRequestModelValidator;
        _codigoUsuarioModelMapper = codigoUsuarioModelMapper;
        _logger = logger;
        _resetUserPasswordRequestModelMapper = resetUserPasswordRequestModelMapper;
    }

    public async Task<(UserReadModel, string, int)> RegisterNewUser(RegisterUserRequestModel registerUserRequestModel, HttpContext? httpContext = null)
    {
        _logger.Information("Validando campos da requisição de cadastro para Username[{Username}]",
            registerUserRequestModel.username);
        ValidationResult validationResult = await _registerUserRequestModelValidator
            .ValidateAsync(registerUserRequestModel);
        if (!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            _logger.Error(exception, "Validation issues");
            throw exception;
        }

        _logger.Information("Verificando se já existe um usuário com o CodigoUsuario[{CodigoUsuario}] e Email[{Email}]",
            registerUserRequestModel.username, registerUserRequestModel.email);
        bool invalidExists = await _usuarioRepository
            .CheckUserByMatriculaAndEmail(registerUserRequestModel.matricula,
                registerUserRequestModel.email);
        if (invalidExists)
        {
            ExistsUserException exception = new(
                registerUserRequestModel.matricula,
                registerUserRequestModel.email
            );
            _logger.Error(exception, "Um usuário com a mesma {registerUserRequestModel.matricula} ou {Email} já existe",
                nameof(registerUserRequestModel.username), nameof(registerUserRequestModel.email));
            throw exception;
        }

        _logger.Information("Recuperando curso relacionado ao CodigoCurso[{CodigoCurso}] do usuário",
            registerUserRequestModel.codeCurso);
        int cursoId = registerUserRequestModel.codeCurso;
        CursoModel? relatedCurso = await _cursoRepository
            .GetCursoById(cursoId);
        if (relatedCurso is null)
        {
            CursoNotFoundException exception = new(cursoId);
            _logger.Error(exception, "Curso não encontrado");
            throw exception;
        }

        DateTime registerDate = DateTime.Now.Date;
        string rawUserPassword = registerUserRequestModel.password;
        UsuarioModel usuarioModel = _registerUserRequestModelMapper
            .RegisterUserRequestModelToUsuarioModel(registerUserRequestModel);
        usuarioModel.curso = relatedCurso;
        usuarioModel.statusUsuario = false;
        usuarioModel.dataCadastroUsuario = new(registerDate.Year, registerDate.Month, registerDate.Day);
        usuarioModel.senhaUsuario = _hashService.Hash(rawUserPassword);
        usuarioModel.tipoUsuario = UserRole.User;

        _logger.Information("Cadastrando usuário Username[{Username}]",
            registerUserRequestModel.username);
        await _usuarioRepository.CreateUser(usuarioModel);

        await GenerateAndSendConfirmationEmail(usuarioModel);
        await _usuarioRepository.FlushChanges();

        _logger.Information("Gerando token de autenticação para ID[{ID}]",
            usuarioModel.idUsuario);
        UserReadModel userReadModel = _usuarioModelMapper.UsuarioModelToUserReadModel(usuarioModel);

        _logger.Information("Usuário ID[{ID}] cadastrado com sucesso",
            usuarioModel.idUsuario);

        var (jwtUser, identity) = _jwtService.GenerateJwtAndReturnClaims(new(userReadModel.id.ToString(), userReadModel.role));

        return (userReadModel, jwtUser, userReadModel.id);
    }

    public async Task<UserReadModel> RegisterNewAdminOrProf(RegisterUserRequestModel registerUserRequestModel)
    {
        _logger.Information("Validando campos da requisição de cadastro para Username[{Username}]",
            registerUserRequestModel.username);
        ValidationResult validationResult = await _registerUserRequestModelValidator
            .ValidateAsync(registerUserRequestModel);
        if (!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            _logger.Error(exception, "Validation issues");
            throw exception;
        }

        _logger.Information("Verificando se já existe um usuário com o CodigoUsuario[{CodigoUsuario}] e Email[{Email}]",
            registerUserRequestModel.username, registerUserRequestModel.email);
        bool invalidExists = await _usuarioRepository
            .CheckUserByMatriculaAndEmail(registerUserRequestModel.matricula,
                registerUserRequestModel.email);
        if (invalidExists)
        {
            ExistsUserException exception = new(
                registerUserRequestModel.matricula,
                registerUserRequestModel.email
            );
            _logger.Error(exception, "Um usuário com o mesmo {NomeUsuario} ou {Email} já existe",
                nameof(registerUserRequestModel.username), nameof(registerUserRequestModel.email));
            throw exception;
        }

        _logger.Information("Recuperando curso relacionado ao CodigoCurso[{CodigoCurso}] do usuário",
            registerUserRequestModel.codeCurso);
        int cursoId = registerUserRequestModel.codeCurso;
        CursoModel? relatedCurso = await _cursoRepository
            .GetCursoById(cursoId);
        if (relatedCurso is null)
        {
            CursoNotFoundException exception = new(cursoId);
            _logger.Error(exception, "Curso não encontrado");
            throw exception;
        }

        DateTime registerDate = DateTime.Now.Date;
        string rawUserPassword = registerUserRequestModel.password;
        UsuarioModel usuarioModel = _registerUserRequestModelMapper
            .RegisterUserRequestModelToUsuarioModel(registerUserRequestModel);
        usuarioModel.curso = relatedCurso;
        usuarioModel.statusUsuario = true;
        usuarioModel.dataCadastroUsuario = new(registerDate.Year, registerDate.Month, registerDate.Day);
        usuarioModel.senhaUsuario = _hashService.Hash(rawUserPassword);
        usuarioModel.tipoUsuario = registerUserRequestModel.role;

        _logger.Information("Cadastrando usuário Username[{Username}]",
            registerUserRequestModel.username);
        await _usuarioRepository.CreateUser(usuarioModel);

        await _usuarioRepository.FlushChanges();

        UserReadModel userReadModel = _usuarioModelMapper.UsuarioModelToUserReadModel(usuarioModel);

        _logger.Information("Usuário ID[{ID}] cadastrado com sucesso",
            usuarioModel.idUsuario);

        return userReadModel;
    }

    public async Task<(UserReadModel, string, int)> LoginUser(UserLoginRequestModel userLoginRequestModel, HttpContext? httpContext = null)
    {
        _logger.Information("Validando campos da requisição de login para Email[{UserEmail}]",
            userLoginRequestModel.email);
        ValidationResult validationResult = await _userLoginRequestModelValidator
            .ValidateAsync(userLoginRequestModel);
        if (!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            _logger.Error(exception, "Validation issues");
            throw exception;
        }

        _logger.Information("Recuperando usuário com Email[{UserEmail}]",
            userLoginRequestModel.email);
        UsuarioModel? usuarioModel = await _usuarioRepository
            .GetUsuarioByEmail(userLoginRequestModel.email, true);
        if (usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userLoginRequestModel.email), userLoginRequestModel.email);
            _logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }

        _logger.Information("Verificando senha do usuário Email[{UserEmail}]",
            userLoginRequestModel.email);
        string hashRequestUserPassword = _hashService.Hash(userLoginRequestModel.password);
        if (usuarioModel.senhaUsuario != hashRequestUserPassword)
        {
            InvalidLoginPasswordException exception = new(userLoginRequestModel.email);
            _logger.Error(exception, "Senha inválida");
            throw exception;
        }

        _logger.Information("Gerando token de autenticação para ID[{ID}]",
            usuarioModel.idUsuario);
        UserReadModel userReadModel = _usuarioModelMapper.UsuarioModelToUserReadModel(usuarioModel);

        var (jwtUser, identity) = _jwtService.GenerateJwtAndReturnClaims(new(userReadModel.id.ToString(), userReadModel.role));

        return (userReadModel, jwtUser, userReadModel.id);
    }

    public async Task<CodigoUsuarioReadModel> ConfirmUserEmail(ConfirmUserEmailRequestModel confirmUserEmailRequestModel,
        int userId)
    {
        _logger.Information("Validando campos da requisição de confirmação de email para ID[{ID}]",
            userId);
        ValidationResult validationResult = await _confirmUserEmailRequestModelValidator
            .ValidateAsync(confirmUserEmailRequestModel);
        if (!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            _logger.Error(exception, "Validation issues");
            throw exception;
        }

        _logger.Information("Recuperando usuário com ID[{ID}]",
            userId);
        UsuarioModel? usuarioModel = await _usuarioRepository.GetUsuarioById(userId, true);
        if (usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userId), userId.ToString());
            _logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }

        _logger.Information("Recuperando código de confirmação de email do usuário ID[{ID}]",
            usuarioModel.idUsuario);
        CodigoUsuarioModel? confirmedUserCode = await _codigoUsuarioRepository
            .GetUserCode(usuarioModel, UserCodeKind.EmailConfirmation);
        if (confirmedUserCode is null)
        {
            ConfirmationCodeNotFoundException exception = new(userId);
            _logger.Error(exception, "Código de confirmação de email não encontrado");
            throw exception;
        }

        _logger.Information("Validando código de confirmação ConfirmationCode[{ConfirmationCode}] de email do usuário ID[{ID}]",
            confirmUserEmailRequestModel.confirmationCode, usuarioModel.idUsuario);
        bool isEqual = confirmedUserCode.codigo == confirmUserEmailRequestModel.confirmationCode;
        if (!isEqual)
        {
            UserCodeNotMatchException exception = new(confirmUserEmailRequestModel.confirmationCode,
                UserCodeKind.EmailConfirmation);
            _logger.Error(exception, "Código de confirmação de email não corresponde ao código válido");
            throw exception;
        }

        _codigoUsuarioRepository.UseCode(confirmedUserCode);
        usuarioModel.statusUsuario = true;
        await _codigoUsuarioRepository.Flush();
        CodigoUsuarioReadModel codigoUsuarioReadModel = _codigoUsuarioModelMapper
            .CodigoUsuarioToCodigoUsuarioReadModel(confirmedUserCode);
        _logger.Information("Email do usuário ID[{ID}] confirmado com sucesso",
            usuarioModel.idUsuario);

        return codigoUsuarioReadModel;
    }

    public async Task<ResetUserPasswordReadModel> ResetUserPassword(ResetUserPasswordRequestModel resetUserPasswordRequestModel)
    {
        _logger.Information("Validando campos da requisição de recuperação de senha para Email[{Email}]",
            resetUserPasswordRequestModel.userEmail);
        ValidationResult validationResult = await _resetUserPasswordRequestModelValidator
            .ValidateAsync(resetUserPasswordRequestModel);
        if (!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            _logger.Error(exception, "Validation issues");
            throw exception;
        }

        _logger.Information("Recuperando usuário com Email[{Email}]",
            resetUserPasswordRequestModel.userEmail);
        UsuarioModel? usuarioModel = await _usuarioRepository
            .GetUsuarioByEmail(resetUserPasswordRequestModel.userEmail);
        if (usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(resetUserPasswordRequestModel.userEmail),
                resetUserPasswordRequestModel.userEmail);
            _logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }

        _logger.Information("Recuperando código de recuperação de senha do usuário ID[{ID}]",
            usuarioModel.idUsuario);
        CodigoUsuarioModel? resetCode = await _codigoUsuarioRepository
            .GetUserCode(usuarioModel, UserCodeKind.PasswordReset);
        if (resetCode is null)
        {
            ResetPasswordCodeNotFoundException exception = new(resetUserPasswordRequestModel.userEmail);
            _logger.Error(exception, "Código de recuperação de senha não encontrado");
            throw exception;
        }

        _logger.Information("Verificando código de recuperação de senha ResetCode[{ResetCode}] do usuário ID[{ID}]",
            resetUserPasswordRequestModel.resetCode, usuarioModel.idUsuario);
        bool isCodeEqual = resetCode.codigo == resetUserPasswordRequestModel.resetCode;
        if (!isCodeEqual)
        {
            UserCodeNotMatchException exception = new(resetUserPasswordRequestModel.resetCode,
                UserCodeKind.PasswordReset);
            _logger.Error(exception, "Código de recuperação de senha não corresponde ao código válido");
            throw exception;
        }

        _codigoUsuarioRepository.UseCode(resetCode);
        string newPassword = _hashService.Hash(resetUserPasswordRequestModel.newPassword);
        usuarioModel.senhaUsuario = newPassword;
        await _codigoUsuarioRepository.Flush();

        _logger.Information("Senha do usuário ID[{ID}] alterada com sucesso",
            usuarioModel.idUsuario);
        ResetUserPasswordReadModel resetUserPasswordReadModel = _resetUserPasswordRequestModelMapper
            .ResetUserPasswordRequestModelToResetUserPasswordReadModel(resetUserPasswordRequestModel);
        return resetUserPasswordReadModel;
    }

    public async Task<bool> RequestConfirmationCode(int userId)
    {
        _logger.Information("Recuperando usuário com ID[{ID}]",
            userId);
        UsuarioModel? usuarioModel = await _usuarioRepository.GetUsuarioById(userId);
        if (usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userId), userId.ToString());
            _logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }
        if (usuarioModel.statusUsuario)
        {
            _logger.Warning("Este usuário já está com Email[{UserEmail}] confirmado",
                usuarioModel.emailUsuario);
        }

        bool emailSended = await GenerateAndSendConfirmationEmail(usuarioModel);
        await _codigoUsuarioRepository.Flush();
        return emailSended;
    }

    public async Task<bool> RequestPasswordResetCode(RequestResetPasswordEmailRequestModel requestResetPasswordEmailRequestModel)
    {
        _logger.Information("Recuperando usuário com Email[{Email}]",
            requestResetPasswordEmailRequestModel.userEmail);
        UsuarioModel? usuarioModel = await _usuarioRepository
            .GetUsuarioByEmail(requestResetPasswordEmailRequestModel.userEmail);
        if (usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(requestResetPasswordEmailRequestModel.userEmail),
                requestResetPasswordEmailRequestModel.userEmail);
            _logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }

        bool emailSended = await GenerateAndSendResetUserPassword(usuarioModel);
        await _codigoUsuarioRepository.Flush();
        return emailSended;
    }

    private async Task<bool> GenerateAndSendResetUserPassword(UsuarioModel usuarioModel)
    {
        bool emailSended = false;

        _logger.Information("Gerando código de recuperação de senha para usuário Email[{UserEmail}]",
            usuarioModel.emailUsuario);
        CodigoUsuarioModel requestAlreadyExists = await _codigoUsuarioRepository
            .GetUserCode(usuarioModel, UserCodeKind.PasswordReset);

        if (requestAlreadyExists == null)
        {
            CodigoUsuarioModel resetCode = await _codigoUsuarioRepository
                .GenerateAndEnsureCode(usuarioModel, UserCodeKind.PasswordReset);
            bool emailSendedAux = await SendResetPasswordEmail(usuarioModel, resetCode);

            if (emailSendedAux)
            {
                _logger.Information("Email de recuperação de senha enviado com sucesso para usuário Email[{UserEmail}]",
                    usuarioModel.emailUsuario);
            }
            else
            {
                _logger.Warning("Não foi possível enviar o email de recuperação de senha para o usuário Email[{UserEmail}]",
                    usuarioModel.emailUsuario);
            }

            emailSended = emailSendedAux;
        }
        else
        {
            emailSended = true;
        }

        return emailSended;
    }

    private async Task<bool> GenerateAndSendConfirmationEmail(UsuarioModel usuarioModel)
    {
        _logger.Information("Gerando código de confirmação de email para usuário Email[{UserEmail}]",
            usuarioModel.emailUsuario);
        CodigoUsuarioModel confirmCode = await _codigoUsuarioRepository
            .GenerateAndEnsureCode(usuarioModel, UserCodeKind.EmailConfirmation);
        _logger.Information("Enviando email de confirmação para usuário Email[{UserEmail}]",
            usuarioModel.emailUsuario);
        bool emailSended = await SendRegisterEmail(usuarioModel, confirmCode);

        if (emailSended)
        {
            _logger.Information("Email de confirmação enviado com sucesso para usuário Email[{UserEmail}]",
                usuarioModel.emailUsuario);
        }
        else
        {
            _logger.Warning("Não foi possível enviar o email de boas vindas para o usuário Email[{UserEmail}]",
                usuarioModel.emailUsuario);
            throw new Exception($"Não foi possível enviar o email para[{usuarioModel.emailUsuario}]. Verifique seu email e tente novamente.");
        }
        return emailSended;
    }

    private async Task<bool> SendRegisterEmail(UsuarioModel usuario, CodigoUsuarioModel confirmCode)
    {
        EmailIntent emailIntent = new()
        {
            toEmail = usuario.emailUsuario,
            subject = "Bem-vindo(a) ao StudyLab",
            template = new VerificationCodeEmailTemplate
            {
                username = usuario.nomeUsuario,
                verificationCode = confirmCode.codigo
            }
        };

        try
        {
            await _emailService.SendEmail(emailIntent);
        }
        catch (Exception e) { return false; }
        return true;
    }

    private async Task<bool> SendResetPasswordEmail(UsuarioModel usuario, CodigoUsuarioModel resetCode)
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
            await _emailService.SendEmail(emailIntent);
        }
        catch (Exception) { return false; }
        return true;
    }

    public async Task<int> ResendVerificationCode(int userId)
    {
        UsuarioModel? usuarioModel = await _usuarioRepository
            .GetUsuarioById(userId);

        if (usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userId), userId.ToString());
            _logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }

        CodigoUsuarioModel? confirmationCode = await _codigoUsuarioRepository
            .GetUserCode(usuarioModel, UserCodeKind.EmailConfirmation);

        if (confirmationCode is null)
        {
            throw new Exception($"Código de confirmação de email não encontrado para o usuário:[{userId}].");
        }

        bool emailSended = await SendRegisterEmail(usuarioModel, confirmationCode);

        if (emailSended)
        {
            _logger.Information("Email de confirmação enviado com sucesso para usuário Email[{UserEmail}]",
                usuarioModel.emailUsuario);
        }
        else
        {
            _logger.Warning("Não foi possível enviar o email de boas vindas para o usuário Email[{UserEmail}]",
                usuarioModel.emailUsuario);
            throw new Exception($"Não foi possível enviar o email para[{usuarioModel.emailUsuario}]. Verifique seu email e tente novamente.");
        }

        return userId;
    }
}