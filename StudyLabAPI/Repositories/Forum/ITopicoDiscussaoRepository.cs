using StudyLabAPI.Models;
using StudyLabAPI.Models.Forum;



/// <summary>
/// Camada de acesso a dados para o <see cref="TopicoDiscussaoModel"/>
/// </summary>
public interface ITopicoDiscussaoRepository
{
    public Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussaoByDisciplina(int idDisciplina);

    public Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussao();
    /// <summary>
    /// Recupera todos os topicos de discuss�o cadastrados
    /// </summary>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna uma <see cref="List{T}"/> com todos os topicos de discuss�o</returns>
    public Task<IList<TopicoDiscussaoModel>> GetTopicosDiscussaoLimitedByPageAndPageSize(int page, int pageSize, int idDisciplina = 0);

    public Task<(IList<TopicoDiscussaoModel>, int, int)> GetTopicosAndCount(int page, int pageSize, int idDisciplina = 0);
    /// <summary>
    /// Recupera um t�pico de discuss�o pelo ID
    /// </summary>
    /// <param name="id">ID do t�pico de discu��o</param>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna o modelo do t�pico de discu��o correspondente ao ID</returns>
    public Task<TopicoDiscussaoModel?> GetTopicosDiscussaoById(int id, bool isAnyAsync = false);

    public Task<bool> VerifyTopicoDiscussaoExists(TopicoDiscussaoModel topicoDiscussao);
    /// <summary>
    /// Verifica se um t�pico de discuss�o existe pelo ID
    /// </summary>
    /// <param name="topicoDiscussao">Modelo do t�pico de discu��o</param>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna <c>true</c> se existir, caso contr�rio, retorna <c>false</c></returns>
    public Task<bool> VerifyTopicoDiscussaoExistsWithId(TopicoDiscussaoModel topicoDiscussao);
    /// <summary>
    /// Cadastra um novo t�pico de discuss�o
    /// </summary>
    /// <param name="topicoDiscussao">Modelo do novo t�pico de discuss�o</param>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task CreateTopicoDiscussao(TopicoDiscussaoModel topicoDiscussao);
    /// <summary>
    /// Atualiza um t�pico de discuss�o existente com novas informa��es
    /// </summary>
    /// <param name="topicoDiscussao">Modelo de um t�pico de discuss�o com o ID existente
    /// mas com novas informa��es</param>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task UpdateTopicoDiscussao(TopicoDiscussaoModel topicoDiscussao);
    /// <summary>
    /// Deleta um t�pico de discuss�o pelo ID
    /// </summary>
    /// <param name="idTopicoDiscussao">ID do t�pico de discuss�o</param>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task DeleteTopicoDiscussao(int idTopicoDiscussao);
    /// <summary>
    /// Salva as altera��es feitas no banco
    /// </summary>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task Flush();
}
