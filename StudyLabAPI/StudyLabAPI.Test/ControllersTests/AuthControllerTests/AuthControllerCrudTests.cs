using FluentValidation;
using Moq;
using Serilog;
using StudyLabAPI.Controllers;
using StudyLabAPI.Mapper;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Enums;
using StudyLabAPI.Repositories;
using StudyLabAPI.Services.Email;
using StudyLabAPI.Services.Email.Models;
using StudyLabAPI.Services.Hash;
using StudyLabAPI.Services.Jwt;
using StudyLabAPI.Services.Jwt.Models;
using StudyLabAPI.Validators;

namespace StudyLabAPI.Test.ControllersTests.AuthControllerTests;

public class AuthControllerCrudTests
{
    private Mock<IUsuarioRepository> usuarioRepositoryMock { get; } = new();
    private Mock<ICursoRepository> cursoRepositoryMock { get; } = new();
    private Mock<ICodigoUsuarioRepository> codigoUsuarioRepositoryMock { get; } = new();
    private Mock<IJwtService> jwtServiceMock { get; } = new();
    private Mock<IEmailService> emailServiceMock { get; } = new();
    private Mock<IHashService> hashServiceMock { get; } = new();
    private Mock<ILogger> loggerMock { get; } = new();
    
    private AuthController authController { get; }
    
    private AuthControllerFakeData fakeData { get; }

    public AuthControllerCrudTests()
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
    public async Task RegisterNewUserTest()
    {
        RegisterUserRequestModel requestModel = fakeData.fakeRegisterUserRequestModel;
        
        usuarioRepositoryMock.Setup(x => 
            x.CheckUserByMatriculaAndEmail(requestModel.matricula, requestModel.email))
            .ReturnsAsync(false);
        cursoRepositoryMock.Setup(x =>
            x.GetCursoById(requestModel.codeCurso))
            .ReturnsAsync(fakeData.fakeCursoModel);
        codigoUsuarioRepositoryMock.Setup(x => 
            x.GenerateAndEnsureCode(It.IsAny<UsuarioModel>(), UserCodeKind.EmailConfirmation))
            .ReturnsAsync(fakeData.fakeEmailConfirmationCodigoUsuarioModel);
        jwtServiceMock.Setup(x => 
            x.GenerateJwt(It.IsAny<JwtPayload>()))
            .Returns(AuthControllerFakeData.FAKE_JWT);
        hashServiceMock.Setup(x => 
            x.Hash(requestModel.password))
            .Returns(AuthControllerFakeData.FAKE_HASH_OUTPUT);
        emailServiceMock.Setup(x => 
            x.SendEmail(It.IsAny<EmailIntent>()));
        
        (UserReadModel readModel, string jwt) = await authController.RegisterNewUser(requestModel);
        
        Assert.Equal(requestModel.username, readModel.username);
        Assert.Equal(requestModel.email, readModel.email);
        Assert.Equal(requestModel.role, readModel.role);
        Assert.False(readModel.active);
        Assert.Equal(requestModel.imagem, readModel.imagem);
        Assert.NotEmpty(jwt);
    }
    
    [Fact]
    public async Task LoginUserTest()
    {
        UserLoginRequestModel loginRequestModel = fakeData.fakeLoginRequestModel;
        UsuarioModel usuarioModel = fakeData.fakeUsuarioModel;
        
        usuarioRepositoryMock.Setup(x => 
            x.GetUsuarioByEmail(loginRequestModel.email))
            .ReturnsAsync(usuarioModel);
        hashServiceMock.Setup(x => 
            x.Hash(loginRequestModel.password))
            .Returns(AuthControllerFakeData.FAKE_HASH_OUTPUT);
        jwtServiceMock.Setup(x => 
            x.GenerateJwt(It.IsAny<JwtPayload>()))
            .Returns(AuthControllerFakeData.FAKE_JWT);
        
        (UserReadModel readModel, string jwt, string antifogeryToken, string sntifogeryCookie) = await authController.LoginUser(loginRequestModel);
        
        Assert.Equal(usuarioModel.nomeUsuario, readModel.username);
        Assert.Equal(usuarioModel.emailUsuario, readModel.email);
        Assert.Equal(usuarioModel.tipoUsuario, readModel.role);
        Assert.Equal(usuarioModel.statusUsuario, readModel.active);
        Assert.Equal(usuarioModel.curso.nomeCurso, readModel.curso.nome);
        Assert.Equal(usuarioModel.imagemUsuario, readModel.imagem);
        Assert.NotEmpty(jwt);
    }
    
    [Fact]
    public async Task ConfirmUserEmailTest()
    {
        ConfirmUserEmailRequestModel confirmUserEmailRequest = fakeData.fakeConfirmUserEmailRequestModel;
        UsuarioModel usuarioModel = fakeData.fakeUsuarioModel;
        CodigoUsuarioModel codigoUsuarioModel = fakeData.fakeEmailConfirmationCodigoUsuarioModel;
        
        usuarioRepositoryMock.Setup(x => 
            x.GetUsuarioById(AuthControllerFakeData.FAKE_USER_ID, false))
            .ReturnsAsync(usuarioModel);
        codigoUsuarioRepositoryMock.Setup(x => 
            x.GetUserCode(usuarioModel, UserCodeKind.EmailConfirmation))
            .ReturnsAsync(codigoUsuarioModel);
        
        CodigoUsuarioReadModel codigoUsuarioReadModel = await authController
            .ConfirmUserEmail(confirmUserEmailRequest, AuthControllerFakeData.FAKE_USER_ID);
        
        Assert.Equal(codigoUsuarioModel.codigo, codigoUsuarioReadModel.code);
        Assert.Equal(codigoUsuarioModel.tipo, codigoUsuarioReadModel.codeKind);
        Assert.True(usuarioModel.statusUsuario);
    }
    
    [Fact]
    public async Task ResetUserPasswordTest()
    {
        ResetUserPasswordRequestModel resetUserPasswordRequest = fakeData.fakeResetUserPasswordRequestModel;
        UsuarioModel usuarioModel = fakeData.fakeUsuarioModel;
        CodigoUsuarioModel codigoUsuarioModel = fakeData.fakeResetUserPasswordCodigoUsuarioModel;
        const string newPasswordHash = "newHash";
        
        usuarioRepositoryMock.Setup(x => 
            x.GetUsuarioByEmail(AuthControllerFakeData.FAKE_EMAIL))
            .ReturnsAsync(usuarioModel);
        codigoUsuarioRepositoryMock.Setup(x => 
            x.GetUserCode(usuarioModel, UserCodeKind.PasswordReset))
            .ReturnsAsync(codigoUsuarioModel);
        hashServiceMock.Setup(x => 
            x.Hash(resetUserPasswordRequest.newPassword))
            .Returns(newPasswordHash);
        
        ResetUserPasswordReadModel resetUserPasswordReadModel = await authController
            .ResetUserPassword(resetUserPasswordRequest);
        
        Assert.Equal(codigoUsuarioModel.codigo, resetUserPasswordReadModel.resetCode);
        Assert.Equal(resetUserPasswordRequest.resetCode, resetUserPasswordReadModel.resetCode);
        Assert.Equal(resetUserPasswordRequest.newPassword, resetUserPasswordReadModel.newPassword);
        Assert.Equal(newPasswordHash, usuarioModel.senhaUsuario);
        
    }
    
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task RequestConfirmationCodeTest(bool statusUsuario)
    {
        CodigoUsuarioModel codigoUsuarioModel = fakeData.fakeEmailConfirmationCodigoUsuarioModel;
        UsuarioModel usuarioModel = fakeData.fakeUsuarioModel;
        usuarioModel.statusUsuario = statusUsuario;
        
        usuarioRepositoryMock.Setup(x =>
            x.GetUsuarioById(AuthControllerFakeData.FAKE_USER_ID, false))
            .ReturnsAsync(usuarioModel);
        codigoUsuarioRepositoryMock.Setup(x =>
            x.GenerateAndEnsureCode(usuarioModel, UserCodeKind.EmailConfirmation))
            .ReturnsAsync(codigoUsuarioModel);
        
        bool success = await authController.RequestConfirmationCode(AuthControllerFakeData.FAKE_USER_ID);
        
        Assert.True(success);
    }
    
    [Fact]
    public async Task RequestPasswordResetCodeTest()
    {
        UsuarioModel usuarioModel = fakeData.fakeUsuarioModel;
        RequestResetPasswordEmailRequestModel requestResetPasswordEmailRequestModel = fakeData.fakeResetPasswordEmailRequestModel;
        CodigoUsuarioModel codigoUsuarioModel = fakeData.fakeResetUserPasswordCodigoUsuarioModel;
        
        usuarioRepositoryMock.Setup(x =>
                x.GetUsuarioByEmail(AuthControllerFakeData.FAKE_EMAIL))
            .ReturnsAsync(usuarioModel);
        codigoUsuarioRepositoryMock.Setup(x =>
                x.GenerateAndEnsureCode(usuarioModel, UserCodeKind.PasswordReset))
            .ReturnsAsync(codigoUsuarioModel);
        
        bool success = await authController
            .RequestPasswordResetCode(requestResetPasswordEmailRequestModel);
        
        Assert.True(success);
    }
}