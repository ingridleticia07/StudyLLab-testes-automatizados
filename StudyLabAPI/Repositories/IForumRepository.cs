using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories;

/// <summary>
/// Camada de acesso a dados para o <see cref="ForumModel"/>
/// </summary>
public interface IForumRepository
{
    /// <summary>
    /// Cadastra um novo forum
    /// </summary>
    /// <param name="Forum">Modelo do novo forum</param>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task CreateForum(ForumModel Forum);
    /// <summary>
    /// Atualiza um forum existente com novas informações
    /// </summary>
    /// <param name="ForumUpdate">Modelo do forum com o ID de um que já existe e novas informações</param>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task UpdateForum(ForumModel ForumUpdate);
    /// <summary>
    /// Salva as alterações feitas no banco
    /// </summary>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task Flush();
}