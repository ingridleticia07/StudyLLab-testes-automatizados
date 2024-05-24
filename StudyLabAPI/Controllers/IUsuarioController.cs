using StudyLabAPI.Exceptions;
using StudyLabAPI.Models;
using StudyLabAPI.Repositories;

namespace StudyLabAPI.Controllers;

/// <summary>
/// Controlador de usuário. Ele é responsável por gerenciar as requisições de CRUD referentes a usuários.
/// Devem ser implementado e cadastrado no container de DI.
/// </summary>
/// <remarks>
/// Deve usar os serviços basicos do container de DI para realizar as operações CRUD de usuários, como
/// <see cref="ILogger"/> e <see cref="IUsuarioRepository"/>. 
/// </remarks>
public interface IUsuarioController
{
    public Task<IReadOnlyList<UserReadModel>> GetUsers(int page, int pageSize);
    /// <summary>
    /// Procura por um usuário pelo ID.
    /// </summary>
    /// <param name="id">ID usado para procurar pelo usuário</param>
    /// <returns>O modelo de leitura do usuário encontrado.</returns>
    /// <exception cref="UsuarioNotFoundException">Se o usuário não for encontrado.</exception>
    public Task<UserReadModel> GetUserInfoById(int id);
}