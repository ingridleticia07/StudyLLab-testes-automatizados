using StudyLabAPI.Exceptions;
using StudyLabAPI.Models;
using StudyLabAPI.Models.User.DTOs;
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
    /// <summary>
    /// Recupera todos os usuários cadastrados no banco, limitados por paginação.
    /// </summary>
    /// <param name="page">Número da página</param>
    /// <param name="pageSize">Tamanho da página</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna os usuários cadastrados
    /// em uma lista do comprimento de <see cref="pageSize"/> ou menor</returns>
    public Task<UsersListResponse> GetUsers(int page, int pageSize,int userType = 0, int statusUsuario = 0, bool onlyProfessor = false);
    /// <summary>
    /// Procura por um usuário pelo ID.
    /// </summary>
    /// <param name="id">ID usado para procurar pelo usuário</param>
    /// <returns>O modelo de leitura do usuário encontrado.</returns>
    /// <exception cref="UsuarioNotFoundException">Se o usuário não for encontrado.</exception>
    public Task<UserReadModel> GetUserInfoById(int id);
    /// <summary>
    /// Atualiza um usuário pelo seu ID
    /// </summary>
    /// <param name="userId">ID do usuário que terá as informações atualizadas</param>
    /// <param name="request">Informações que serão atualiazdos, novos valores</param>
    /// <returns>O modelo de leitura do usuário atualizado</returns>
    public Task<UserReadModel> UpdateUserById(int userId, UpdateUserRequestModel request);
    /// <summary>
    /// Deleta um usuário pelo seu ID
    /// </summary>
    /// <param name="userId">ID do usuário que será deletado</param>
    /// <returns>O ID do usuário deletado</returns>
    public Task<int> DeleteUser(int userId);
}