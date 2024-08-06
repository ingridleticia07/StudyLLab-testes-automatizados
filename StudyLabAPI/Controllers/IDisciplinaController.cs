using StudyLabAPI.Models;
using StudyLabAPI.Repositories;

namespace StudyLabAPI.Controllers;

/// <summary>
/// Controlador das diciplinas. Ele é responsável por gerenciar as requisições relacionadas com disciplina.
/// Nele, é possível realizar o cadastro de uma nova disciplina, atualizar uma disciplina já existente e
/// deletar uma disciplina
/// Deve ser implementado e cadastrado no container de DI.
/// </summary>
/// <remarks>
/// Deve usar os serviços basicos do container de DI para realizar as operações de autenticação, como
/// <see cref="ILogger"/>, <see cref="IDisciplinaRepository"/> e <see cref="ICursoRepository"/>. 
/// </remarks>
public interface IDisciplinaController
{
    /// <summary>
    /// Retorna uma disciplina com o id especificado.
    /// </summary>
    /// <param name="id">ID da disciplina</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna o modelo da disciplina com o ID correspondente</returns>
    public Task<DisciplinaReadModel> GetDisciplinaById(int id);
    /// <summary>
    /// Recupera todas as disciplinas cadastradas.
    /// </summary>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna uma <see cref="List{T}"/> com todas as disciplinas</returns>
    public Task<DisciplinaListResponse> GetAllDisciplinas(int page, int pageSize);
    /// <summary>
    /// Verifica se a disciplina especificada no modelo existe.
    /// </summary>
    /// <param name="disciplina">Modelo da requisição com as informações da disciplina</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna <c>true</c> se existir, caso contrário, <c>false</c></returns>
    public Task<bool> VerifyDisciplinaCreated(RegisterDisciplinaRequestModel disciplina);
    /// <summary>
    /// Verificar se a disciplina com ID especificada no modelo existe.
    /// </summary>
    /// <param name="disciplina">Modelo da requisição com as informações da disciplina.
    /// Deve conter o ID</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna <c>true</c> se existir, caso contrário, <c>false</c></returns>
    public Task<bool> VerifyDisciplinaCreatedWithId(int disciplinaId);
    /// <summary>
    /// Trata da requisição de criação de uma nova disciplina.
    /// </summary>
    /// <param name="disciplinaModel">Modelo com as informação</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna o modelo com as informações da disciplina criada</returns>
    public Task<DisciplinaReadModel> CreateDisciplina(RegisterDisciplinaRequestModel disciplinaModel);
    /// <summary>
    /// Atualiza as informações de uma disciplina já existentes.
    /// </summary>
    /// <param name="disciplinaModel">Modelo com o ID de uma disciplina existente
    /// mas com informações atualizadas</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna o modelo da disciplina com as informações atualizadas</returns>
    public Task<DisciplinaReadModel> UpdateDisciplina(RegisterDisciplinaRequestModel disciplinaModel);
    /// <summary>
    /// Deleta uma disciplina com o ID especificado.
    /// </summary>
    /// <param name="idDisciplina">Modelo da disciplina com ID da entidade que será excluida</param>
    /// <returns>Representa uma tarefa assíncrona</returns>
    public Task DeleteDisciplina(int disciplinaIdentifier);
}