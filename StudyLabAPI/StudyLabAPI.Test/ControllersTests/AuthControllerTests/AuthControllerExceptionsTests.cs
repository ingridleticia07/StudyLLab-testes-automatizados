using FluentValidation;
using Moq;
using Serilog;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Mapper;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Auth;
using StudyLabAPI.Models.Auth.Enums;
using StudyLabAPI.Models.User;
using StudyLabAPI.Models.User.DTOs;
using StudyLabAPI.Repositories.Auth;
using StudyLabAPI.Repositories.Curso;
using StudyLabAPI.Repositories.Disciplina;
using StudyLabAPI.Repositories.Forum;
using StudyLabAPI.Repositories.Material;
using StudyLabAPI.Repositories.User;
using StudyLabAPI.Services.Application.Auth;
using StudyLabAPI.Services.Email;
using StudyLabAPI.Services.Hash;
using StudyLabAPI.Services.Jwt;
using StudyLabAPI.Validators;
using ValidationException = StudyLabAPI.Exceptions.ValidationException;

namespace StudyLabAPI.Test.ControllersTests.AuthControllerTests;

public class AuthControllerExceptionsTests
{
    private Mock<IUsuarioRepository> usuarioRepositoryMock { get; } = new();
    private Mock<ICursoRepository> cursoRepositoryMock { get; } = new();
    private Mock<ICodigoUsuarioRepository> codigoUsuarioRepositoryMock { get; } = new();
    private Mock<IJwtService> jwtServiceMock { get; } = new();
    private Mock<IEmailService> emailServiceMock { get; } = new();
    private Mock<IHashService> hashServiceMock { get; } = new();
    private Mock<ILogger> loggerMock { get; } = new();
    
    private AuthService authService { get; }
    
    private AuthControllerFakeData fakeData { get; }

    public AuthControllerExceptionsTests()
    {
        UsuarioModelMapper usuarioModelMapper = new();
        RegisterUserRequestModelMapper registerUserRequestModelMapper = new();
        CodigoUsuarioModelMapper codigoUsuarioModelMapper = new();
        ResetUserPasswordRequestModelMapper resetUserPasswordRequestModelMapper = new();
        
        IValidator<RegisterUserRequestModel> registerUserRequestModelValidator = new RegisterUserRequestModelValidator();
        IValidator<UserLoginRequestModel> userLoginRequestModelValidator = new UserLoginRequestModelValidator();
        IValidator<ConfirmUserEmailRequestModel> confirmUserEmailRequestModelValidator = new ConfirmUserEmailRequestModelValidator();
        IValidator<ResetUserPasswordRequestModel> resetUserPasswordRequestModelValidator = new ResetUserPasswordRequestModelValidator();
        
        fakeData = new();
    }

    [Fact]
    public async Task RegisterNewUserValidationExceptionTest()
    {
        RegisterUserRequestModel requestModel = fakeData.fakeInvalidRegisterUserRequestModel;
        
        await Assert.ThrowsAsync<ValidationException>(() => authService.RegisterNewUser(requestModel));
    }
    
    /// <summary>
    /// Deve jogar a exceção <see cref="ExistsUserException"/> quando já existe um usuário com o mesmo email e código de usuário
    /// </summary>
    [Fact]
    public async Task RegisterNewUserInvalidExistentUserTest()
    {
        RegisterUserRequestModel requestModel = fakeData.fakeRegisterUserRequestModel;
        
        usuarioRepositoryMock.Setup(x => 
            x.CheckUserByMatriculaAndEmail(requestModel.matricula, requestModel.email))
            .ReturnsAsync(true);
        
        await Assert.ThrowsAsync<ExistsUserException>(() => authService.RegisterNewUser(requestModel));
    }
    
    [Fact]
    public async Task RegisterNewUserNotExistsCursoByIdTest()
    {
        RegisterUserRequestModel requestModel = fakeData.fakeRegisterUserRequestModel;
        
        usuarioRepositoryMock.Setup(x => 
            x.CheckUserByMatriculaAndEmail(requestModel.matricula, requestModel.email))
            .ReturnsAsync(false);
        cursoRepositoryMock.Setup(x => 
            x.GetCursoById(requestModel.codeCurso))
            .ReturnsAsync(() => null);
        
        await Assert.ThrowsAsync<CursoNotFoundException>(() => authService.RegisterNewUser(requestModel));
    }
    
    [Fact]
    public async Task LoginUserValidationExceptionTest()
    {
        UserLoginRequestModel requestModel = fakeData.fakeInvalidLoginRequestModel;
        
        await Assert.ThrowsAsync<ValidationException>(() => authService.LoginUser(requestModel));
    }
    
    [Fact]
    public async Task LoginUserNotExistUserByEmailTest()
    {
        UserLoginRequestModel requestModel = fakeData.fakeLoginRequestModel;
        
        usuarioRepositoryMock.Setup(x =>
            x.GetUsuarioByEmail(requestModel.email, false))
            .ReturnsAsync(() => null);
        
        await Assert.ThrowsAsync<UsuarioNotFoundException>(() => authService.LoginUser(requestModel));
    }
    
    [Fact]
    public async Task LoginUserInvalidPasswordTest()
    {
        UserLoginRequestModel requestModel = fakeData.fakeLoginRequestModel;
        UsuarioModel usuarioModel = fakeData.fakeUsuarioModel;
        const string invalidPasswordHash = "invalidHash";
        
        usuarioRepositoryMock.Setup(x =>
            x.GetUsuarioByEmail(requestModel.email, false))
            .ReturnsAsync(usuarioModel);
        hashServiceMock.Setup(x =>
            x.Hash(requestModel.password))
            .Returns(invalidPasswordHash);
        
        await Assert.ThrowsAsync<InvalidLoginPasswordException>(() => authService.LoginUser(requestModel));
    }
    
    [Fact]
    public async Task ConfirmEmailUserNotFoundTest()
    {
        ConfirmUserEmailRequestModel requestModel = fakeData.fakeConfirmUserEmailRequestModel;
        
        usuarioRepositoryMock.Setup(x =>
            x.GetUsuarioById(AuthControllerFakeData.FAKE_USER_ID, false))
            .ReturnsAsync(() => null);
        
        await Assert.ThrowsAsync<UsuarioNotFoundException>(() => authService
            .ConfirmUserEmail(requestModel, AuthControllerFakeData.FAKE_USER_ID));
    }

    [Fact]
    public async Task ConfirmEmailUserValidationExceptionTest()
    {
        ConfirmUserEmailRequestModel requestModel = fakeData.fakeInvalidConfirmUserEmailRequestModel;
        
        await Assert.ThrowsAsync<ValidationException>(() => authService
            .ConfirmUserEmail(requestModel, AuthControllerFakeData.FAKE_USER_ID));
    }
    
    [Fact]
    public async Task ConfirmEmailUserNotFoundCodigoUsuarioTest()
    {
        ConfirmUserEmailRequestModel requestModel = fakeData.fakeConfirmUserEmailRequestModel;
        UsuarioModel usuarioModel = fakeData.fakeUsuarioModel;
        
        usuarioRepositoryMock.Setup(x =>
            x.GetUsuarioById(AuthControllerFakeData.FAKE_USER_ID, false))
            .ReturnsAsync(usuarioModel);
        codigoUsuarioRepositoryMock.Setup(x =>
            x.GetUserCode(usuarioModel, UserCodeKind.EmailConfirmation))
            .ReturnsAsync(() => null);
        
        await Assert.ThrowsAsync<ConfirmationCodeNotFoundException>(() => authService
            .ConfirmUserEmail(requestModel, AuthControllerFakeData.FAKE_USER_ID));
    }
    
    [Fact]
    public async Task ConfirmEmailUserNotMathCodigoUsuarioTest()
    {
        const string invalidConfirmationCode = "5678";
        ConfirmUserEmailRequestModel requestModel = fakeData.fakeConfirmUserEmailRequestModel;
        UsuarioModel usuarioModel = fakeData.fakeUsuarioModel;
        CodigoUsuarioModel codigoUsuarioModel = fakeData.fakeEmailConfirmationCodigoUsuarioModel;
        codigoUsuarioModel.codigo = invalidConfirmationCode;
        
        usuarioRepositoryMock.Setup(x =>
            x.GetUsuarioById(AuthControllerFakeData.FAKE_USER_ID, false))
            .ReturnsAsync(usuarioModel);
        codigoUsuarioRepositoryMock.Setup(x =>
            x.GetUserCode(usuarioModel, UserCodeKind.EmailConfirmation))
            .ReturnsAsync(codigoUsuarioModel);
        
        await Assert.ThrowsAsync<UserCodeNotMatchException>(() => authService
            .ConfirmUserEmail(requestModel, AuthControllerFakeData.FAKE_USER_ID));
    }

    [Fact]
    public async Task ResetUserPasswordUserValidationExceptionTest()
    {
        ResetUserPasswordRequestModel requestModel = fakeData.fakeInvalidResetUserPasswordRequestModel;
        
        await Assert.ThrowsAsync<ValidationException>(() => authService
            .ResetUserPassword(requestModel));
    }
    
    [Fact]
    public async Task ResetUserPasswordValidationExceptionTest()
    {
        ResetUserPasswordRequestModel requestModel = fakeData. fakeInvalidResetUserPasswordRequestModel;
        
        await Assert.ThrowsAsync<ValidationException>(() => authService
            .ResetUserPassword(requestModel));
    }
    
    [Fact]
    public async Task ResetUserPasswordUserNotFoundTest()
    {
        ResetUserPasswordRequestModel requestModel = fakeData.fakeResetUserPasswordRequestModel;
        
        usuarioRepositoryMock.Setup(x =>
            x.GetUsuarioById(AuthControllerFakeData.FAKE_USER_ID, false))
            .ReturnsAsync(() => null);
        
        await Assert.ThrowsAsync<UsuarioNotFoundException>(() => authService
            .ResetUserPassword(requestModel));
    }
    
    [Fact]
    public async Task ResetUserPasswordUserNotFoundCodigoUsuarioTest()
    {
        ResetUserPasswordRequestModel requestModel = fakeData.fakeResetUserPasswordRequestModel;
        UsuarioModel usuarioModel = fakeData.fakeUsuarioModel;
        
        usuarioRepositoryMock.Setup(x =>
            x.GetUsuarioByEmail(AuthControllerFakeData.FAKE_EMAIL, false))
            .ReturnsAsync(usuarioModel);
        codigoUsuarioRepositoryMock.Setup(x =>
            x.GetUserCode(usuarioModel, UserCodeKind.PasswordReset))
            .ReturnsAsync(() => null);
        
        await Assert.ThrowsAsync<ResetPasswordCodeNotFoundException>(() => authService
            .ResetUserPassword(requestModel));
    }
    
    [Fact]
    public async Task ResetUsePasswordNotMatchCodigoUsuarioTest()
    {
        const string invalidConfirmationCode = "5678";
        ResetUserPasswordRequestModel requestModel = fakeData.fakeResetUserPasswordRequestModel;
        UsuarioModel usuarioModel = fakeData.fakeUsuarioModel;
        CodigoUsuarioModel codigoUsuarioModel = fakeData.fakeEmailConfirmationCodigoUsuarioModel;
        codigoUsuarioModel.codigo = invalidConfirmationCode;
        
        usuarioRepositoryMock.Setup(x =>
            x.GetUsuarioByEmail(AuthControllerFakeData.FAKE_EMAIL, false))
            .ReturnsAsync(usuarioModel);
        codigoUsuarioRepositoryMock.Setup(x =>
            x.GetUserCode(usuarioModel, UserCodeKind.PasswordReset))
            .ReturnsAsync(codigoUsuarioModel);
        
        await Assert.ThrowsAsync<UserCodeNotMatchException>(() => authService
            .ResetUserPassword(requestModel));
    }
    
    [Fact]
    public async Task RequestConfirmationCodeUserNotFoundTest()
    {
        usuarioRepositoryMock.Setup(x =>
            x.GetUsuarioById(AuthControllerFakeData.FAKE_USER_ID, false));
        
        await Assert.ThrowsAsync<UsuarioNotFoundException>(() => 
            authService.RequestConfirmationCode(AuthControllerFakeData.FAKE_USER_ID));
    }
    
    [Fact]
    public async Task RequestPasswordResetUserNotFoundTest()
    {
        RequestResetPasswordEmailRequestModel requestResetPasswordEmailRequestModel = 
            fakeData.fakeResetPasswordEmailRequestModel;
        
        usuarioRepositoryMock.Setup(x =>
            x.GetUsuarioByEmail(AuthControllerFakeData.FAKE_EMAIL, false));
        
        await Assert.ThrowsAsync<UsuarioNotFoundException>(() => 
            authService.RequestPasswordResetCode(requestResetPasswordEmailRequestModel));
    }
}
