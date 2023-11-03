using StudyLabAPI.Exceptions;
using StudyLabAPI.Models;
using StudyLabAPI.Repositories;
using StudyLabAPI.Services.Jwt;

namespace StudyLabAPI.Controllers;

/// <summary>
/// Controlador de autenticação. Ele é responsável por gerenciar as requisições de autenticação.
/// Nele, é possível realizar o registro de um novo usuário e o login de um usuário já existente.
/// Deve ser implementado e cadastrado no container de DI.
/// </summary>
/// <remarks>
/// Deve usar os serviços basicos do container de DI para realizar as operações de autenticação, como
/// <see cref="ILogger"/>, <see cref="IUsuarioRepository"/>, <see cref="ICursoRepository"/>, <see cref="JwtService"/>. 
/// </remarks>
public interface IAuthController
{
    /// <summary>
    /// Cadastra um novo usuario no sistema.
    /// Os campos recebidos em <paramref name="registerUserRequestModel"/> são validados de acordo com //TODO: Validation.
    /// O ID do curso recebido em <paramref name="registerUserRequestModel"/> é usado para relacionar o usuário com o curso,
    /// portanto o curso com este ID deve já estar cadastrado.
    /// </summary>
    /// <param name="registerUserRequestModel">Informações do usuário para cadastro</param>
    /// <returns>Representa uma tarefa assíncrona, ela retorna uma tupla contendo as informações cadastradas no banco
    /// e um JWT válido para o usuário.</returns>
    /// <exception cref="CursoNotFound"><c>codeCurso</c> de <paramref name="registerUserRequestModel"/>
    /// não pertence a nenhum curso.</exception>
    public Task<(UserReadModel, string)> RegisterNewUser(RegisterUserRequestModel registerUserRequestModel);
    /// <summary>
    /// Realiza o login de um usuário já cadastrado no sistema.
    /// Os campos recebidos em &lt;paramref name="registerUserRequestModel"/&gt; são validados de acordo com //TODO: Validation.
    /// Nenhuma mudança no banco é feita, apenas resgata as informações do usuário, faz verificações de segurança
    /// e gera um JWT válido.
    /// </summary>
    /// <param name="userLoginRequestModel">Informações de um usuário já cadastrado.</param>
    /// <returns>Representa uma tarefa assíncrona, ela retorna uma tupla com as informações referentes ao usuário
    /// e um JWT válido</returns>
    public Task<(UserReadModel, string)> LoginUser(UserLoginRequestModel userLoginRequestModel);
    public Task<CodigoUsuarioReadModel> ConfirmUserEmail(ConfirmUserEmailRequestModel confirmUserEmailRequestModel,
        int userId);
    public Task<ResetUserPasswordReadModel> ResetUserPassword(ResetUserPasswordRequestModel resetUserPasswordRequestModel,
        int userId);
    public Task<bool> RequestPasswordResetCode(int userId);
    public Task<bool> RequestConfirmationCode(int userId);
}