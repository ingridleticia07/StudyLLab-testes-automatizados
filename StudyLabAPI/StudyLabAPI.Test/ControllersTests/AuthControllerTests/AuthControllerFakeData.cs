using StudyLabAPI.Models;
using StudyLabAPI.Models.Enums;

namespace StudyLabAPI.Test.ControllersTests.AuthControllerTests;

public class AuthControllerFakeData
{
    public const string FAKE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjAiLCJyb2xlIjoiVXNlciIsIm5iZiI6MTY5ODI1Mjg1OSwiZXhwIjoxNjk4MjcwODU5LCJpYXQiOjE2OTgyNTI4NTksImlzcyI6IlN0dWR5TGFiQVBJIiwiYXVkIjoiU3R1ZHlMYWJXZWIifQ.qGgy10EM6-fpVAsDd38pw9knoSxrYnktlyflh0Ux3hQ";
    public const string FAKE_HASH_OUTPUT = "hash";
    public const int FAKE_USER_ID = 0;
    private const string RESET_PASSWORD_CONFIRMATION_EMAIL_CODE = "1234";
    private const string USER_PASSWORD = "Test123";

    public UsuarioModel fakeUsuarioModel =>
        new()
        {
            idUsuario = FAKE_USER_ID,
            emailUsuario = "test@test.com",
            codigoUsuario = 1234,
            senhaUsuario = FAKE_HASH_OUTPUT,
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
            password = USER_PASSWORD,
            codigoUsuario = 1234,
            role = UserRole.User,
            codeCurso = 1,
            imagem = null
        };
    public ConfirmUserEmailRequestModel fakeConfirmUserEmailRequestModel => 
        new()
        {
            confirmationCode = RESET_PASSWORD_CONFIRMATION_EMAIL_CODE
        };
    public UserLoginRequestModel fakeLoginRequestModel =>
        new()
        {
            email = "test@test.com",
            password = USER_PASSWORD
        };
    public ResetUserPasswordRequestModel fakeResetUserPasswordRequestModel =>
        new()
        {
            currentPassword = USER_PASSWORD,
            newPassword = "NewTest",
            resetCode = RESET_PASSWORD_CONFIRMATION_EMAIL_CODE
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
            codigo = RESET_PASSWORD_CONFIRMATION_EMAIL_CODE,
            tipo = UserCodeKind.EmailConfirmation,
            usuarioModel = fakeUsuarioModel
        };
    public CodigoUsuarioModel fakeResetUserPasswordCodigoUsuarioModel =>
        new()
        {
            id = 0,
            codigo = RESET_PASSWORD_CONFIRMATION_EMAIL_CODE,
            tipo = UserCodeKind.PasswordReset,
            usuarioModel = fakeUsuarioModel
        };
}