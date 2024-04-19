using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories;

/// <summary>
/// Camada de acesso a dados para a tabela <see cref="UsuarioModel"/>.
/// </summary>
public interface IUsuarioRepository
{
    /// <summary>
    /// Encontra um usuário pelo ID.
    /// </summary>
    /// <param name="id">ID do usuário</param>
    /// <returns>Representa uma tarefa assíncrona do banco,
    /// ela retorna o resultado da busca ou <c>null</c></returns>
    public Task<UsuarioModel?> GetUsuarioById(int id);
    /// <summary>
    /// Encontra um usuário pelo email.
    /// </summary>
    /// <param name="email">Email que será usado para a busca</param>
    /// <returns>Representa uma tarefa assíncrona do banco,
    /// ela retorna o resultado da busca ou <c>null</c></returns>
    public Task<UsuarioModel?> GetUsuarioByEmail(string email);
    /// <summary>
    /// Verifica se há um usuario com o <paramref name="matricula"/> ou <paramref name="email"/>
    /// já cadastrado no banco.
    /// </summary>
    /// <param name="matricula">Matrícula do usuario para verficiação.</param>
    /// <param name="email">Email para verificação.</param>
    /// <returns><c>true</c> se já houver cadastro no banco, caso contrário <c>false</c></returns>
    public Task<bool> CheckUserByMatriculaAndEmail(string matricula, string email);
    /// <summary>
    /// Adiciona o usuario ao banco de dados.
    /// </summary>
    /// <param name="usuarioModel">Entidade que será adicionada ao banco.</param>
    /// <returns>Representa uma tarefa assíncrona do banco.</returns>
    /// <remarks>O campo <c>idUsuario</c> da entidade <paramref name="usuarioModel"/>
    /// não deve conter valor.</remarks>
    public Task CreateUser(UsuarioModel usuarioModel);
    /// <summary>
    /// Salva todas as alterações feitas no banco de dados.
    /// </summary>
    /// <returns>Representa uma tarefa assíncrona do banco.</returns>
    public Task Flush();
}