using StudyLabAPI.Models;
using StudyLabAPI.Repositories;

namespace StudyLabAPI.Controllers;

/// <summary>
/// Controlador do forum. Ele é responsável por gerenciar as requisições relacionadas com forum.
/// </summary>
/// <remarks>
/// Deve usar os serviços basicos do container de DI para realizar as operações de autenticação, como
/// <see cref="ILogger"/>, <see cref="ITopicoDiscussaoRepository"/>, <see cref="IUsuarioRepository"/>,
/// <see cref="IDisciplinaRepository"/>, <see cref="IRespostaForumRepository"/> e <see cref="IForumRepository"/> 
/// </remarks>
//TODO: Separa em outros dois controladores, um para tópicos de discussão e outro para respostas de forum
public interface IForumController
{
    /// <summary>
    /// Recupera todos os tópicos cadastrados
    /// </summary>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna uma <see cref="List{T}"/> com todos os tópicos</returns>
    public Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussao();
    /// <summary>
    /// Cadastra um novo tópico de discussão
    /// </summary>
    /// <param name="topicoDiscussao">Modelo de uma nova discução</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna o modelo do novo tópico cadastrado</returns>
    public Task<TopicoDiscussaoModel> CreateTopicoDiscussao(RegisteredTopicoDiscussaoRequestModel topicoDiscussao);
    /// <summary>
    /// Atualiza as informações de um tópico de discussão já existente
    /// </summary>
    /// <param name="topicoDiscussaoModel">Modelo do tópico de discução com o ID de um já existente
    /// mas com as informações atualizadas</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna o modelo do tópico com as informações atualizadas</returns>
    public Task<TopicoDiscussaoModel> UpdateTopicoDiscussao(RegisteredTopicoDiscussaoRequestModel topicoDiscussaoModel);
    /// <summary>
    /// Verifica se o tópico de discussão especificado no modelo existe
    /// </summary>
    /// <param name="topicoDiscussao">Modelo do tópico de discução que será usado para verificar se existe</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna <c>true</c> se existir, caso contrário, será retornado <c>false</c></returns>
    public Task<bool> VerifyTopicoDiscussaoExists(RegisteredTopicoDiscussaoRequestModel topicoDiscussao);
    /// <summary>
    /// Verifica se o tópico de discussão com o ID especificado no modelo existe
    /// </summary>
    /// <param name="topicoDiscussao">Modelo do tópico de discução que será usado para verificar se existe</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna <c>true</c> se existir, caso contrário, será retornado <c>false</c></returns>
    public Task<bool> VerifyTopicoDiscussaoExistsWithId(RegisteredTopicoDiscussaoRequestModel topicoDiscussao);
    /// <summary>
    /// Deleta um tópico de discussão
    /// </summary>
    /// <param name="idTopicoDiscussao">Modelo do tópico de discução com o ID da entidade que será excluida</param>
    /// <returns>Representa uma tarefa assíncrona</returns>
    public Task DeleteTopicoDiscussao(TopicoDiscussaoModel idTopicoDiscussao);
    /// <summary>
    /// Recupera todas as resposatas dos foruns cadastrados
    /// </summary>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna uma <see cref="List{T}"/> com todas as respostas dos foruns</returns>
    public Task<List<RespostaForumModel?>> GetAllRespostasForum();
    /// <summary>
    /// Verifica se a resposta do forum especificada no modelo existe
    /// </summary>
    /// <param name="respostaForum">Modelo de reposta do forum com ID para verificação</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna <c>true</c> se existir, caso contrário, <c>false</c></returns>
    public Task<bool> VerifyRespostaForumExists(RegisteredRespostaForumModel respostaForum);
    /// <summary>
    /// Verifica se a resposta do forum com o ID especificado no modelo existe
    /// </summary>
    /// <param name="respostaForum">Modelo de resposta do forum com ID para verificação</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna <c>true</c> se existir, caso contrário, <c>false</c></returns>
    public Task<bool> VerifyRespostaForumExistsWithId(RegisteredRespostaForumModel respostaForum);
    /// <summary>
    /// Cadastra uma nova resposta a um forum
    /// </summary>
    /// <param name="respostaForum">Modelo de resposta a um forum</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna o modelo da resposta cadastrada</returns>
    public Task<RegisteredRespostaForumModel> CreateRespostaForum(RegisteredRespostaForumModel respostaForum);
    /// <summary>
    /// Atualiza as informações de uma resposta a um forum já existente
    /// </summary>
    /// <param name="respostaForum">Modelo de resposta com ID de uma entidade existente
    /// mas com novas informações</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna o modelo de uma resposta a um forum com as informações atualizadas</returns>
    public Task<RespostaForumModel> UpdateRespostaForum(RegisteredRespostaForumModel respostaForum);
    /// <summary>
    /// Deleta uma resposta a um forum
    /// </summary>
    /// <param name="respostaForum">Modelo da resposta com ID da entidade que será excluida</param>
    /// <returns>Representa uma tarefa assíncrona</returns>
    public Task DeleteRespostaForum(RespostaForumModel respostaForum);
    /// <summary>
    /// Cadastra um novo forum
    /// </summary>
    /// <param name="respostaForum">Modelo com as informações do novo forum</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna o modelo do novo forum</returns>
    public Task<ForumModel> CreateForum(ResgisteredForumModel respostaForum);
    /// <summary>
    /// Atualiza as informações de um forum já existente
    /// </summary>
    /// <param name="updateForum">Modelo do forum com o ID de um já existente
    /// mas com as informações atualizadas</param>
    /// <returns>Representa uma tarefa assíncrona,
    /// ela retorna o modelo do forum com as informações atualizadas</returns>
    public Task<ForumModel> UpdateForum(ResgisteredForumModel updateForum);
}