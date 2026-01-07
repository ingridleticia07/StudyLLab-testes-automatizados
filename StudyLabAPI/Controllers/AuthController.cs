using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Antiforgery;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Mapper;
using StudyLabAPI.Models;
using StudyLabAPI.Repositories;
using StudyLabAPI.Services.Email;
using StudyLabAPI.Services.Email.Models;
using StudyLabAPI.Services.Email.Models.Template;
using StudyLabAPI.Services.Hash;
using StudyLabAPI.Services.Jwt;
using StudyLabAPI.Validators;
using System.Security.Claims;
using StudyLabAPI.Models.Auth;
using StudyLabAPI.Models.Auth.Enums;
using StudyLabAPI.Models.Curso;
using StudyLabAPI.Models.User;
using StudyLabAPI.Models.User.DTOs;
using StudyLabAPI.Models.User.Enums;
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

    /// <summary>
    /// Cadastra um novo usuário. Ele irá validar os campos da requisição, verificar se já existe um usuário com o mesmo código de usuário (matrícula) e email,
    /// relacionar o curso ao usuário, gerar uma senha criptografada, cadastrar o usuário, gerar um token de autenticação e enviar um email de confirmação.
    /// </summary>
    /// <param name="registerUserRequestModel">Modelo usado para transferir as infomaçoes do futuro usuario vindo da requisição.</param>
    /// <returns>Retorna o modelo de leitura (<see cref="UserReadModel"/>) do usuário cadastrado e o token de autenticação.</returns>
    /// <exception cref="ValidationException">Ocorre quando alguma informação contradiz alguma regra de validação.
    /// Regras: <seealso cref="RegisterUserRequestModelValidator"/>.</exception>
    /// <exception cref="ExistsUserException">Ocorre quando já existe algum usuário com a mesma matrícula ou email.</exception>
    /// <exception cref="CursoNotFoundException">Ocorre quando o curso solicitado para relação não existe.</exception>
    public async Task<(UserReadModel, string, int)> RegisterNewUser(RegisterUserRequestModel registerUserRequestModel, HttpContext? httpContext = null)
    {
        logger.Information("Validando campos da requisição de cadastro para Username[{Username}]",
            registerUserRequestModel.username);
        ValidationResult validationResult = await registerUserRequestModelValidator
            .ValidateAsync(registerUserRequestModel);
        if (!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            logger.Error(exception, "Validation issues");
            throw exception;
        }

        logger.Information("Verificando se já existe um usuário com o CodigoUsuario[{CodigoUsuario}] e Email[{Email}]",
            registerUserRequestModel.username, registerUserRequestModel.email);
        bool invalidExists = await usuarioRepository
            .CheckUserByMatriculaAndEmail(registerUserRequestModel.matricula,
                registerUserRequestModel.email);
        if (invalidExists)
        {
            ExistsUserException exception = new(
                registerUserRequestModel.matricula,
                registerUserRequestModel.email
            );
            logger.Error(exception, "Um usuário com o mesmo {NomeUsuario} ou {Email} já existe",
                nameof(registerUserRequestModel.username), nameof(registerUserRequestModel.email));
            throw exception;
        }

        logger.Information("Recuperando curso relacionado ao CodigoCurso[{CodigoCurso}] do usuário",
            registerUserRequestModel.codeCurso);
        int cursoId = registerUserRequestModel.codeCurso;
        CursoModel? relatedCurso = await cursoRepository
            .GetCursoById(cursoId);
        if (relatedCurso is null)
        {
            CursoNotFoundException exception = new(cursoId);
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
        usuarioModel.tipoUsuario = UserRole.User;        

        logger.Information("Cadastrando usuário Username[{Username}]",
            registerUserRequestModel.username);
        await usuarioRepository.CreateUser(usuarioModel);

        await GenerateAndSendConfirmationEmail(usuarioModel);
        await usuarioRepository.FlushChanges();

        logger.Information("Gerando token de autenticação para ID[{ID}]",
            usuarioModel.idUsuario);
        UserReadModel userReadModel = usuarioModelMapper.UsuarioModelToUserReadModel(usuarioModel);

        logger.Information("Usuário ID[{ID}] cadastrado com sucesso",
        usuarioModel.idUsuario);
        
        var (jwtUser, identity) = jwtService.GenerateJwtAndReturnClaims(new(userReadModel.id.ToString(), userReadModel.role));
        
        return (userReadModel, jwtUser, userReadModel.id);

    }

    public async Task<UserReadModel> RegisterNewAdminOrProf(RegisterUserRequestModel registerUserRequestModel)
    {
        logger.Information("Validando campos da requisição de cadastro para Username[{Username}]",
            registerUserRequestModel.username);
        ValidationResult validationResult = await registerUserRequestModelValidator
            .ValidateAsync(registerUserRequestModel);
        if (!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            logger.Error(exception, "Validation issues");
            throw exception;
        }

        logger.Information("Verificando se já existe um usuário com o CodigoUsuario[{CodigoUsuario}] e Email[{Email}]",
            registerUserRequestModel.username, registerUserRequestModel.email);
        bool invalidExists = await usuarioRepository
            .CheckUserByMatriculaAndEmail(registerUserRequestModel.matricula,
                registerUserRequestModel.email);
        if (invalidExists)
        {
            ExistsUserException exception = new(
                registerUserRequestModel.matricula,
                registerUserRequestModel.email
            );
            logger.Error(exception, "Um usuário com o mesmo {NomeUsuario} ou {Email} já existe",
                nameof(registerUserRequestModel.username), nameof(registerUserRequestModel.email));
            throw exception;
        }

        logger.Information("Recuperando curso relacionado ao CodigoCurso[{CodigoCurso}] do usuário",
            registerUserRequestModel.codeCurso);
        int cursoId = registerUserRequestModel.codeCurso;
        CursoModel? relatedCurso = await cursoRepository
            .GetCursoById(cursoId);
        if (relatedCurso is null)
        {
            CursoNotFoundException exception = new(cursoId);
            logger.Error(exception, "Curso não encontrado");
            throw exception;
        }

        DateTime registerDate = DateTime.Now.Date;
        string rawUserPassword = registerUserRequestModel.password;
        UsuarioModel usuarioModel = registerUserRequestModelMapper
            .RegisterUserRequestModelToUsuarioModel(registerUserRequestModel);
        usuarioModel.curso = relatedCurso;
        usuarioModel.statusUsuario = true;
        usuarioModel.dataCadastroUsuario = new(registerDate.Year, registerDate.Month, registerDate.Day);
        usuarioModel.senhaUsuario = hashService.Hash(rawUserPassword);
        usuarioModel.tipoUsuario = registerUserRequestModel.role;

        logger.Information("Cadastrando usuário Username[{Username}]",
            registerUserRequestModel.username);
        await usuarioRepository.CreateUser(usuarioModel);

        await usuarioRepository.FlushChanges();

        UserReadModel userReadModel = usuarioModelMapper.UsuarioModelToUserReadModel(usuarioModel);

        logger.Information("Usuário ID[{ID}] cadastrado com sucesso",
        usuarioModel.idUsuario);

        return userReadModel;

    }


    /// <summary>
    /// Realiza a autenticação de um usuário. Ele irá validar os campos da requisição, verificar se o usuário existe, verificar se a senha está correta
    /// e gerar o token de autenticação.
    /// </summary>
    /// <param name="userLoginRequestModel">Modelo usado para transferir as infomações de login da requisição para o controller.</param>
    /// <returns>Retorna o modelo de leitura (<see cref="UserReadModel"/>) do usuário cadastrado e o token de autenticação.</returns>
    /// <exception cref="ValidationException">Ocorre quando alguma informação contradiz alguma regra de validação.
    /// Regras: <seealso cref="UserLoginRequestModelValidator"/>.</exception>
    /// <exception cref="UsuarioNotFoundException"></exception>
    /// <exception cref="InvalidLoginPasswordException"></exception>
    public async Task<(UserReadModel, string, int)> LoginUser(UserLoginRequestModel userLoginRequestModel, HttpContext? httpContext = null)
    {
        logger.Information("Validando campos da requisição de login para Email[{UserEmail}]",
            userLoginRequestModel.email);
        ValidationResult validationResult = await userLoginRequestModelValidator
            .ValidateAsync(userLoginRequestModel);
        if (!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            logger.Error(exception, "Validation issues");
            throw exception;
        }

        logger.Information("Recuperando usuário com Email[{UserEmail}]",
            userLoginRequestModel.email);
        UsuarioModel? usuarioModel = await usuarioRepository
            .GetUsuarioByEmail(userLoginRequestModel.email, true);
        if (usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userLoginRequestModel.email), userLoginRequestModel.email);
            logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }

        logger.Information("Verificando senha do usuário Email[{UserEmail}]",
            userLoginRequestModel.email);
        string hashRequestUserPassword = hashService.Hash(userLoginRequestModel.password);
        if (usuarioModel.senhaUsuario != hashRequestUserPassword)
        {
            InvalidLoginPasswordException exception = new(userLoginRequestModel.email);
            logger.Error(exception, "Senha inválida");
            throw exception;
        }

        logger.Information("Gerando token de autenticação para ID[{ID}]",
            usuarioModel.idUsuario);
        UserReadModel userReadModel = usuarioModelMapper.UsuarioModelToUserReadModel(usuarioModel);

        var (jwtUser, identity) = jwtService.GenerateJwtAndReturnClaims(new(userReadModel.id.ToString(), userReadModel.role));
        
        return (userReadModel, jwtUser, userReadModel.id);
    }

    /// <summary>
    /// Confirma a conta de um usuário, usando o código enviado pelo email ao cadastrar-se ou solicitar um novo código por
    /// <see cref="RequestConfirmationCode"/>. Ele valida os campos da requisição, verifica se o usuário existe, se o código de confirmação
    /// estiver correto, ele irá confirma a conta, se não ele irá lançar uma exceção.
    /// </summary>
    /// <param name="confirmUserEmailRequestModel">Informação sobre o codigo enviado na requisição</param>
    /// <param name="userId">Usuário a qual o codigo está relacionado</param>
    /// <returns>Informações sobre o código válidado</returns>
    /// <exception cref="ValidationException">Ocorre quando alguma informação contradiz alguma regra de validação.
    /// Regras: <seealso cref="ConfirmUserEmailRequestModelValidator"/>.</exception>
    /// <exception cref="UsuarioNotFoundException">Ocorre quando um usuário não é encontrado.</exception>
    /// <exception cref="ConfirmationCodeNotFoundException">Ocorre quando o código recebido no modelo não existe.</exception>
    /// <exception cref="UserCodeNotMatchException">Ocorre quando o código recebido no modelo não é igual ao criado anteriormente.</exception>
    public async Task<CodigoUsuarioReadModel> ConfirmUserEmail(ConfirmUserEmailRequestModel confirmUserEmailRequestModel,
        int userId)
    {
        logger.Information("Validando campos da requisição de confirmação de email para ID[{ID}]",
            userId);
        ValidationResult validationResult = await confirmUserEmailRequestModelValidator
            .ValidateAsync(confirmUserEmailRequestModel);
        if (!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            logger.Error(exception, "Validation issues");
            throw exception;
        }

        logger.Information("Recuperando usuário com ID[{ID}]",
            userId);
        UsuarioModel? usuarioModel = await usuarioRepository.GetUsuarioById(userId,true);
        if (usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userId), userId.ToString());
            logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }

        logger.Information("Recuperando código de confirmação de email do usuário ID[{ID}]",
            usuarioModel.idUsuario);
        CodigoUsuarioModel? confirmedUserCode = await codigoUsuarioRepository
            .GetUserCode(usuarioModel, UserCodeKind.EmailConfirmation);
        if (confirmedUserCode is null)
        {
            ConfirmationCodeNotFoundException exception = new(userId);
            logger.Error(exception, "Código de confirmação de email não encontrado");
            throw exception;
        }
        logger.Information("Validando código de confirmação ConfirmationCode[{ConfirmationCode}] de email do usuário ID[{ID}]",
            confirmUserEmailRequestModel.confirmationCode, usuarioModel.idUsuario);
        bool isEqual = confirmedUserCode.codigo == confirmUserEmailRequestModel.confirmationCode;
        if (!isEqual)
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

    /// <summary>
    /// Usa o código de recuperação de senha para alterar a senha do usuário. Ele irá validar os campos da requisição, verificar se o usuário existe,
    /// verifica se o código recebido é igual ao código gerado anteriormente, alterar a senha do usuário e invalidar o código de recuperação.
    /// </summary>
    /// <param name="resetUserPasswordRequestModel">Modelo que contém as informações de recuperação de senha</param>
    /// <returns>Retornar o mesmo modelo recebido por parâmetro.</returns>
    /// <exception cref="ValidationException">Ocorre quando alguma informação contradiz alguma regra de validação.
    /// Regras: <seealso cref="ConfirmUserEmailRequestModelValidator"/>.</exception>
    /// <exception cref="UsuarioNotFoundException">Ocorre quando o usuário não é encontrado</exception>
    /// <exception cref="ResetPasswordCodeNotFoundException">Ocorre quando o codigo de recuperação não é encontrado ou não existe.</exception>
    /// <exception cref="UserCodeNotMatchException">O código recebido não é o mesmo que esta no banco.</exception>
    public async Task<ResetUserPasswordReadModel> ResetUserPassword(ResetUserPasswordRequestModel resetUserPasswordRequestModel)
    {
        logger.Information("Validando campos da requisição de recuperação de senha para Email[{Email}]",
            resetUserPasswordRequestModel.userEmail);
        ValidationResult validationResult = await resetUserPasswordRequestModelValidator
            .ValidateAsync(resetUserPasswordRequestModel);
        if (!validationResult.IsValid)
        {
            ValidationException exception = new(validationResult.Errors
                .Select(e => e.ErrorMessage));
            logger.Error(exception, "Validation issues");
            throw exception;
        }

        logger.Information("Recuperando usuário com Email[{Email}]",
            resetUserPasswordRequestModel.userEmail);
        UsuarioModel? usuarioModel = await usuarioRepository
            .GetUsuarioByEmail(resetUserPasswordRequestModel.userEmail);
        if (usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(resetUserPasswordRequestModel.userEmail),
                resetUserPasswordRequestModel.userEmail);
            logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }

        logger.Information("Recuperando código de recuperação de senha do usuário ID[{ID}]",
            usuarioModel.idUsuario);
        CodigoUsuarioModel? resetCode = await codigoUsuarioRepository
            .GetUserCode(usuarioModel, UserCodeKind.PasswordReset);
        if (resetCode is null)
        {
            ResetPasswordCodeNotFoundException exception = new(resetUserPasswordRequestModel.userEmail);
            logger.Error(exception, "Código de recuperação de senha não encontrado");
            throw exception;
        }
        logger.Information("Verificando código de recuperação de senha ResetCode[{ResetCode}] do usuário ID[{ID}]",
            resetUserPasswordRequestModel.resetCode, usuarioModel.idUsuario);
        bool isCodeEqual = resetCode.codigo == resetUserPasswordRequestModel.resetCode;
        if (!isCodeEqual)
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

    /// <summary>
    /// Requisita um novo email de confirmação para o usuário. Ele verifica se há um usuário com este ID e se o email já foi confirmado
    /// (não impede de enviar um novo email de confirmação, mas não é necessário, pois o email já foi confirmado). 
    /// </summary>
    /// <param name="userId">ID do usuário.</param>
    /// <returns>Se o email foi enviado com sucesso.</returns>
    /// <exception cref="UsuarioNotFoundException">Ocorre quando o usuario não foi encontrado.</exception>
    public async Task<bool> RequestConfirmationCode(int userId)
    {
        logger.Information("Recuperando usuário com ID[{ID}]",
            userId);
        UsuarioModel? usuarioModel = await usuarioRepository.GetUsuarioById(userId);
        if (usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userId), userId.ToString());
            logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }
        if (usuarioModel.statusUsuario)
        {
            logger.Warning("Este usuário já está com Email[{UserEmail}] confirmado",
                usuarioModel.emailUsuario);
        }

        bool emailSended = await GenerateAndSendConfirmationEmail(usuarioModel);
        await codigoUsuarioRepository.Flush();
        return emailSended;
    }

    /// <summary>
    /// Requisita um codigo de recuperação de senha para o usuário. Ele verifica se o usuário existe e gera um novo código de recuperação.
    /// </summary>
    /// <param name="requestResetPasswordEmailRequestModel">Informações para envio do email de recuperação.</param>
    /// <returns>Se o email foi enviado com sucesso.</returns>
    /// <exception cref="UsuarioNotFoundException">Ocorre quando o usuário não existe</exception>
    public async Task<bool> RequestPasswordResetCode(RequestResetPasswordEmailRequestModel requestResetPasswordEmailRequestModel)
    {
        logger.Information("Recuperando usuário com Email[{Email}]",
            requestResetPasswordEmailRequestModel.userEmail);
        UsuarioModel? usuarioModel = await usuarioRepository
            .GetUsuarioByEmail(requestResetPasswordEmailRequestModel.userEmail);
        if (usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(requestResetPasswordEmailRequestModel.userEmail),
                requestResetPasswordEmailRequestModel.userEmail);
            logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }

        bool emailSended = await GenerateAndSendResetUserPassword(usuarioModel);
        await codigoUsuarioRepository.Flush();
        return emailSended;
    }

    async private Task<bool> GenerateAndSendResetUserPassword(UsuarioModel usuarioModel)
    {
        bool emailSended = false;

        logger.Information("Gerando código de recuperação de senha para usuário Email[{UserEmail}]",
            usuarioModel.emailUsuario);
        CodigoUsuarioModel requestAlreadyExists = await codigoUsuarioRepository
            .GetUserCode(usuarioModel, UserCodeKind.PasswordReset);

        if (requestAlreadyExists == null)
        {
            CodigoUsuarioModel resetCode = await codigoUsuarioRepository
            .GenerateAndEnsureCode(usuarioModel, UserCodeKind.PasswordReset);
            bool emailSendedAux = await SendResetPasswordEmail(usuarioModel, resetCode);

            if (emailSendedAux)
            {
                logger.Information("Email de recuperação de senha enviado com sucesso para usuário Email[{UserEmail}]",
                    usuarioModel.emailUsuario);
            }
            else
            {
                logger.Warning("Não foi possível enviar o email de recuperação de senha para o usuário Email[{UserEmail}]",
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

    async private Task<bool> GenerateAndSendConfirmationEmail(UsuarioModel usuarioModel)
    {
        logger.Information("Gerando código de confirmação de email para usuário Email[{UserEmail}]",
            usuarioModel.emailUsuario);
        CodigoUsuarioModel confirmCode = await codigoUsuarioRepository
            .GenerateAndEnsureCode(usuarioModel, UserCodeKind.EmailConfirmation);
        logger.Information("Enviando email de confirmação para usuário Email[{UserEmail}]",
            usuarioModel.emailUsuario);
        bool emailSended = await SendRegisterEmail(usuarioModel, confirmCode);

        if (emailSended)
        {
            logger.Information("Email de confirmação enviado com sucesso para usuário Email[{UserEmail}]",
                 usuarioModel.emailUsuario);
        }
        else
        {
            logger.Warning("Não foi possível enviar o email de boas vindas para o usuário Email[{UserEmail}]",
                usuarioModel.emailUsuario);
            throw new Exception($"Não foi possível enviar o email para[{usuarioModel.emailUsuario}]. Verifique seu email e tente novamente.");
        }
        return emailSended;
    }
    async private Task<bool> SendRegisterEmail(UsuarioModel usuario, CodigoUsuarioModel confirmCode)
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
            await emailService.SendEmail(emailIntent);
        }
        catch (Exception e) { return false; }
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

    public async Task<int> ResendVerificationCode(int userId)
    {
        UsuarioModel? usuarioModel = await usuarioRepository
            .GetUsuarioById(userId);

        if (usuarioModel is null)
        {
            UsuarioNotFoundException exception = new(nameof(userId), userId.ToString());
            logger.Error(exception, "Usuário não encontrado");
            throw exception;
        }

        CodigoUsuarioModel? confirmationCode = await codigoUsuarioRepository
            .GetUserCode(usuarioModel, UserCodeKind.EmailConfirmation);

        if (confirmationCode is null)
        {
            throw new Exception($"Código de confirmação de email não encontrado para o usuário:[{userId}].");
        }

        bool emailSended = await SendRegisterEmail(usuarioModel, confirmationCode);

        if (emailSended)
        {
            logger.Information("Email de confirmação enviado com sucesso para usuário Email[{UserEmail}]",
                 usuarioModel.emailUsuario);
        }
        else
        {
            logger.Warning("Não foi possível enviar o email de boas vindas para o usuário Email[{UserEmail}]",
                usuarioModel.emailUsuario);
            throw new Exception($"Não foi possível enviar o email para[{usuarioModel.emailUsuario}]. Verifique seu email e tente novamente.");
        }

        return userId;
    }
}