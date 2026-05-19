using StudyLabAPI.Models;
using StudyLabAPI.Models.Curso;



/// <summary>
/// Camada de acesso a dados para a tabela <see cref="CursoModel"/>.
/// </summary>
public interface ICursoRepository
{
    /// <summary>
    /// Encontra um curso pelo ID.
    /// </summary>
    /// <param name="id">ID do curso</param>
    /// <returns>Representa uma tarefa asincrona do banco,
    /// ela retorna o resultado da busca ou <c>null</c></returns>
    public Task<CursoModel?> GetCursoById(int id);
}
