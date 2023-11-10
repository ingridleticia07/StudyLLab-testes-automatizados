using StudyLabAPI.Models;
using StudyLabAPI.Models.Enums;
using StudyLabAPI.Services.Email.Models;

namespace StudyLabAPI.Test.ControllersTests.AuthControllerTests;

public class AuthControllerFakeData
{
    public readonly string FakeJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjAiLCJyb2xlIjoiVXNlciIsIm5iZiI6MTY5ODI1Mjg1OSwiZXhwIjoxNjk4MjcwODU5LCJpYXQiOjE2OTgyNTI4NTksImlzcyI6IlN0dWR5TGFiQVBJIiwiYXVkIjoiU3R1ZHlMYWJXZWIifQ.qGgy10EM6-fpVAsDd38pw9knoSxrYnktlyflh0Ux3hQ";
    public readonly string FakeHashOutput = "hash";
    public readonly int FakeUserId = 0;
    public readonly string ResetPasswordConfirmationEmailCode = "1234";
    public readonly string UserPassword = "Test123";
    
    public UsuarioModel fakeUsuarioModel =>
        new()
        {
            idUsuario = FakeUserId,
            emailUsuario = "test@test.com",
            codigoUsuario = 1234,
            senhaUsuario = FakeHashOutput,
            statusUsuario = false,
            tipoUsuario = UserRole.User,
            curso = fakeCursoModel,
            nomeUsuario = "Test",
            dataCadastroUsuario = new(),
            imagemUsuario = null
        };
    public RegisterUserRequestModel fakeRegisterUserRequestModel =>
        new()
        {
            username = "Test",
            email = "test@test.com",
            password = UserPassword,
            codigoUsuario = 1234,
            role = UserRole.User,
            codeCurso = 1,
            imagem = null
        };
    public ConfirmUserEmailRequestModel fakeConfirmUserEmailRequestModel => 
        new()
        {
            confirmationCode = ResetPasswordConfirmationEmailCode
        };
    public UserLoginRequestModel fakeLoginRequestModel =>
        new()
        {
            email = "test@test.com",
            password = UserPassword
        };
    public ResetUserPasswordRequestModel fakeResetUserPasswordRequestModel =>
        new()
        {
            currentPassword = UserPassword,
            newPassword = "NewTest",
            resetCode = ResetPasswordConfirmationEmailCode
        };
    public CursoModel fakeCursoModel =>
        new()
        {
            idCurso = 1,
            nomeCurso = "CursoTest"
        };
    public CodigoUsuarioModel fakeEmailConfirmationCodigoUsuarioModel =>
        new()
        {
            id = 0,
            codigo = ResetPasswordConfirmationEmailCode,
            tipo = UserCodeKind.EmailConfirmation,
            usuarioModel = fakeUsuarioModel
        };
    public CodigoUsuarioModel fakeResetUserPasswordCodigoUsuarioModel =>
        new()
        {
            id = 0,
            codigo = ResetPasswordConfirmationEmailCode,
            tipo = UserCodeKind.PasswordReset,
            usuarioModel = fakeUsuarioModel
        };
}