using StudyLabAPI.Models;
using StudyLabAPI.Models.Auth;
using StudyLabAPI.Models.Auth.Enums;
using StudyLabAPI.Models.User;



/// <summary>
/// Camada de acesso a dados para a tabela <see cref="CodigoUsuarioModel"/>.
/// </summary>
public interface ICodigoUsuarioRepository
{
    /// <summary>
    /// Encontra um código de usuário pelo usuário e tipo.
    /// </summary>
    /// <param name="usuarioModel">Modelo do usuário correspondente</param>
    /// <param name="codeKind">Tipo do codigo</param>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna o codigo encontrado ou se não encontrar retorna <c>null</c></returns>
    public Task<CodigoUsuarioModel?> GetUserCode(UsuarioModel usuarioModel, UserCodeKind codeKind);
    /// <summary>
    /// Remove o código como se ele tivesse sido usado. Nenhuma alteração é feita nas propriedades
    /// do usuário correspondente ao código, apenas o código é removido, portanto, atualize as informações do usuário
    /// conforme o nescessário.
    /// </summary>
    /// <param name="codigoUsuarioModel">Código que será removido</param>
    /// <returns>Retorna o modelo do código removido</returns>
    public CodigoUsuarioModel UseCode(CodigoUsuarioModel codigoUsuarioModel);

    public Task<int> DeleteAllUsersCodes(UsuarioModel usuarioModel);
    /// <summary>
    /// Gerá um novo código para o usuário com o tipo especificado, se houver outro codigo do mesmo tipo atrelado a este
    /// usuário, ele será removido e o novo código será gerado.
    /// </summary>
    /// <param name="usuarioModel">Modelo do usuário que será relacionado o novo código</param>
    /// <param name="codeKind">Tipo do código</param>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna o modelo do novo código gerado para o usuário</returns>
    public Task<CodigoUsuarioModel> GenerateAndEnsureCode(UsuarioModel usuarioModel, UserCodeKind codeKind);
    /// <summary>
    /// Salva todas as alterações feitas no banco.
    /// </summary>
    /// <returns>Representa uma tarefa asincrona do banco</returns>
    public Task Flush();
}
