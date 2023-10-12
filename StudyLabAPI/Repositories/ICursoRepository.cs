using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories;

public interface ICursoRepository
{
    public Task<CursoModel?> GetCursoById(int id);
}