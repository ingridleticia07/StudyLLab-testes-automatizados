using StudyLabAPI.Models;
using StudyLabAPI.Models.Forum;

namespace StudyLabAPI.Repositories;

/// <summary>
/// Camada de acesso a dados para o <see cref="TopicoDiscussaoModel"/>
/// </summary>
public interface ITopicoDiscussaoRepository
{
    public Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussaoByDisciplina(int idDisciplina);

    public Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussao();
    /// <summary>
    /// Recupera todos os topicos de discussão cadastrados
    /// </summary>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna uma <see cref="List{T}"/> com todos os topicos de discussão</returns>
    public Task<IList<TopicoDiscussaoModel>> GetTopicosDiscussaoLimitedByPageAndPageSize(int page, int pageSize, int idDisciplina = 0);

    public Task<(IList<TopicoDiscussaoModel>, int, int)> GetTopicosAndCount(int page, int pageSize, int idDisciplina = 0);
    /// <summary>
    /// Recupera um tópico de discussão pelo ID
    /// </summary>
    /// <param name="id">ID do tópico de discução</param>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna o modelo do tópico de discução correspondente ao ID</returns>
    public Task<TopicoDiscussaoModel?> GetTopicosDiscussaoById(int id, bool isAnyAsync = false);

    public Task<bool> VerifyTopicoDiscussaoExists(TopicoDiscussaoModel topicoDiscussao, int idDisciplina = 0);
    /// <summary>
    /// Verifica se um tópico de discussão existe pelo ID
    /// </summary>
    /// <param name="topicoDiscussao">Modelo do tópico de discução</param>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna <c>true</c> se existir, caso contrário, retorna <c>false</c></returns>
    public Task<bool> VerifyTopicoDiscussaoExistsWithId(TopicoDiscussaoModel topicoDiscussao);
    /// <summary>
    /// Cadastra um novo tópico de discussão
    /// </summary>
    /// <param name="topicoDiscussao">Modelo do novo tópico de discussão</param>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task CreateTopicoDiscussao(TopicoDiscussaoModel topicoDiscussao);
    /// <summary>
    /// Atualiza um tópico de discussão existente com novas informações
    /// </summary>
    /// <param name="topicoDiscussao">Modelo de um tópico de discussão com o ID existente
    /// mas com novas informações</param>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task UpdateTopicoDiscussao(TopicoDiscussaoModel topicoDiscussao);
    /// <summary>
    /// Deleta um tópico de discussão pelo ID
    /// </summary>
    /// <param name="idTopicoDiscussao">ID do tópico de discussão</param>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task DeleteTopicoDiscussao(int idTopicoDiscussao);
    /// <summary>
    /// Salva as alterações feitas no banco
    /// </summary>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task Flush();
}