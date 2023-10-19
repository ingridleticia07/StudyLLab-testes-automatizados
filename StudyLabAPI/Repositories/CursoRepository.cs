using StudyLabAPI.Context;
using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories;

/// <summary>
/// Implementação genérica do repositório <see cref="ICursoRepository"/>.
/// </summary>
public class CursoRepository : ICursoRepository
{
    private AppDbContext dbContext { get; }

    public CursoRepository(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }
    
    public async Task<CursoModel?> GetCursoById(int id) =>
        await dbContext.cursos.FindAsync(id);
}