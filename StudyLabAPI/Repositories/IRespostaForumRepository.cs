using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories;

/// <summary>
/// Camada de acesso a dados para o <see cref="RespostaForumModel"/>
/// </summary>
public interface IRespostaForumRepository
{
    /// <summary>
    /// Retorna todas as respostas de forum cadastradas
    /// </summary>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna uma <see cref="List{T}"/> com todas as repostas</returns>
    public Task<List<RespostaForumModel?>> GetAllRespostasForum();
    /// <summary>
    /// Recupera uma resposta de forum pelo ID
    /// </summary>
    /// <param name="id">ID da resposta do forum</param>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna o modelo encontrado da reposta do forum, caso contrário,
    /// ele vai retornar <c>null</c></returns>
    public Task<RespostaForumModel?> GetRespostaForumById(int id);
    /// <summary>
    /// Verifica se uma resposta de forum existe
    /// </summary>
    /// <param name="respostaForum">Modelo da resposta do forum</param>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna <c>true</c> se existir, caso contrário, <c>false</c></returns>
    public Task<bool> VerifyRespostaForumExists(RespostaForumModel respostaForum);
    /// <summary>
    /// Verifica se uma resposta de forum existe pelo ID
    /// </summary>
    /// <param name="respostaForum">Reposta do forum com o ID de um já existente</param>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna <c>true</c> se existir, caso contrário, <c>false</c></returns>
    public Task<bool> VerifyRespostaForumExistsWithId(RespostaForumModel respostaForum);
    /// <summary>
    /// Cadastra uma nova resposta de forum
    /// </summary>
    /// <param name="respostaForum">Modelo da resposta do forum</param>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task CreateRespostaForum(RespostaForumModel respostaForum);
    /// <summary>
    /// Atualiza uma resposta de forum existente com novas informações
    /// </summary>
    /// <param name="respostaForum">Modelo da resposta do forum com o ID de um já existente
    /// com novas informações</param>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task UpdateRespostaForum(RespostaForumModel respostaForum);
    /// <summary>
    /// Deleta uma resposta de forum pelo ID
    /// </summary>
    /// <param name="idRespostaForum">ID da resposta do forum</param>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task DeleteRespostaForum(int idRespostaForum);
    /// <summary>
    /// Salva as alterações feitas no banco
    /// </summary>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task Flush();
}