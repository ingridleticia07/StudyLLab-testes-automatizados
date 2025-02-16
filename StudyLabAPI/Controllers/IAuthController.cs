using StudyLabAPI.Exceptions;
using StudyLabAPI.Models;
using StudyLabAPI.Repositories;
using StudyLabAPI.Services.Jwt;
using StudyLabAPI.Validators;

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
    //TODO: Documentar também as exceções que cada metodo pode jogar
    /// <summary>
    /// Cadastra um novo usuario no sistema.
    /// Os campos recebidos em <paramref name="registerUserRequestModel"/> são validados de acordo com<see cref="RegisterUserRequestModelValidator"/>.
    /// O ID do curso recebido em <paramref name="registerUserRequestModel"/> é usado para relacionar o usuário com o curso,
    /// portanto o curso com este ID deve já estar cadastrado.
    /// </summary>
    /// <param name="registerUserRequestModel">Informações do usuário para cadastro</param>
    /// <returns>Representa uma tarefa assíncrona, ela retorna uma tupla contendo as informações cadastradas no banco
    /// e um JWT válido para o usuário.</returns>
    /// <exception cref="CursoNotFoundException"><c>codeCurso</c> de <paramref name="registerUserRequestModel"/>
    /// não pertence a nenhum curso.</exception>
    public Task<(UserReadModel, string, int)> RegisterNewUser(RegisterUserRequestModel registerUserRequestModel, bool isProfessor = false);
    /// <summary>
    /// Realiza o login de um usuário já cadastrado no sistema.
    /// Os campos recebidos em &lt;paramref name="registerUserRequestModel"/&gt; são validados de acordo com <see cref="UserLoginRequestModelValidator"/>
    /// Nenhuma mudança no banco é feita, apenas resgata as informações do usuário, faz verificações de segurança
    /// e gera um JWT válido.
    /// </summary>
    /// <param name="userLoginRequestModel">Informações de um usuário já cadastrado.</param>
    /// <returns>Representa uma tarefa assíncrona, ela retorna uma tupla com as informações referentes ao usuário
    /// e um JWT válido</returns>
    public Task<(UserReadModel, string, string, string, int)> LoginUser(UserLoginRequestModel userLoginRequestModel, HttpContext? httpContext);
    /// <summary>
    /// Usa o código de confirmação em <paramref name="confirmUserEmailRequestModel"/> para confirmar o email,
    /// se o código não for valido, a confirmação não acontecerá.
    /// A requisição será validada de acordo com <see cref="ConfirmUserEmailRequestModelValidator"/>.
    /// </summary>
    /// <param name="confirmUserEmailRequestModel">Informações para confirmação</param>
    /// <param name="userId">ID de um usuário já cadastrado, o codigo também tem que ser referente a este usuário</param>
    /// <returns>Representa uma tarefa assíncrona, ela retorna informações sobre a confirmação caso aconteça</returns>
    public Task<CodigoUsuarioReadModel> ConfirmUserEmail(ConfirmUserEmailRequestModel confirmUserEmailRequestModel,
        int userId);
    /// <summary>
    /// Usa o codigo de recuperação de senha, juntamente com a senha antiga para alterar a senha do usuário.
    /// Ela só será alterada caso a o código seja válido e a senha antiga corresponda a senha do usuário.
    /// A requisição será validada de acordo com <see cref="ResetUserPasswordRequestModelValidator"/>.
    /// </summary>
    /// <param name="resetUserPasswordRequestModel">Informações para a redefinição da senha do usuário</param>
    /// <returns>Representa uma tarefa assíncrona, ela retorna informações sobre a redefinição da senha do usuário
    /// caso aconteça</returns>
    public Task<ResetUserPasswordReadModel> ResetUserPassword(ResetUserPasswordRequestModel resetUserPasswordRequestModel);
    /// <summary>
    /// Cria e envia um email de recuperação de senha para o usuário, contendo o código de recuperação.
    /// O antigo código será invalidado e não será possivel usá-lo, ao invés disso, um novo código será gerado.
    /// </summary>
    /// <param name="requestResetPasswordEmailRequestModel">Informações para envio do email de recuperação.</param>
    /// <returns>Representa uma tarefa assíncrona, ela retorna <c>true</c> se o email foi enviado com sucesso,
    /// caso contrario, ela vai retornar <c>false</c></returns>
    public Task<bool> RequestPasswordResetCode(RequestResetPasswordEmailRequestModel requestResetPasswordEmailRequestModel);
    public Task<bool> RequestConfirmationCode(int userId);
}