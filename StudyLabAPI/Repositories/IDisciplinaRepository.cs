using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories;

/// <summary>
/// Camada de acesso a dados para a tabela <see cref="DisciplinaModel"/>.
/// </summary>
public interface IDisciplinaRepository
{
    /// <summary>
    /// Recupera uma disciplina pelo ID.
    /// </summary>
    /// <param name="id">ID da disciplina</param>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna o modelo da disciplina encontrada</returns>
    public Task<DisciplinaModel?> GetDisciplinaById(int id);

    public Task<DisciplinaModel?> GetDisciplinaByIdForUpdateTopico(int id);
    /// <summary>
    /// Verifica se uma disciplina existe no banco
    /// </summary>
    /// <param name="disciplina">Modelo da disciplina</param>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna <c>true</c> se a disciplina existir no banco,
    /// caso contrário, retorna <c>false</c></returns>
    public Task<bool> VerifyDisciplinaCreated(DisciplinaModel disciplina);
    /// <summary>
    /// Verfica se uma disciplina existe no banco, exceto pelo ID.
    /// </summary>
    /// <param name="disciplina">Modelo da disciplina</param>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna <c>true</c> se a disciplina existir no banco,
    /// caso contrário, retorna <c>false</c></returns>
    public Task<bool> VerifyDisciplinaCreatedWithId(int disciplinaId);
    /// <summary>
    /// Recupera as disciplinas no banco com paginação.
    /// </summary>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna uma <see cref="List{T}"/> contendo todas as disciplinas</returns>
    public Task<IList<DisciplinaModel>> GetAllDisciplinasWithPagination(int page, int pageSize);
    /// <summary>
    /// Recupera todas as disciplinas no banco.
    /// </summary>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna uma <see cref="List{T}"/> contendo todas as disciplinas</returns>
    public Task<List<DisciplinaModel>> GetAllDisciplinas();
    /// <summary>
    /// Cadastra uma nova disciplina
    /// </summary>
    /// <param name="disciplinaModel">Modelo da nova disciplina</param>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    /// 
    public Task<(IList<DisciplinaModel>, int, int)> GetDisciplinasAndCount(int page, int pageSize);

    public Task CreateDisciplina(DisciplinaModel disciplinaModel);
    /// <summary>
    /// Atualiza uma disciplina existente com novas informações
    /// </summary>
    /// <param name="disciplinaModel">Modelo da disciplina com o ID que já esta cadastrado
    /// mas com as novas informações</param>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task UpdateDisciplina(DisciplinaModel disciplinaModel);
    /// <summary>
    /// Deleta uma disciplina
    /// </summary>
    /// <param name="idDisciplina">ID de uma disciplina existente</param>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task DeleteDisciplina(int idDisciplina);
    /// <summary>
    /// Salva todas as alterações feitas no banco.
    /// </summary>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task Flush();
}