using StudyLabAPI.Context;
using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public interface IDisciplinaRepository
    {
        public Task<DisciplinaModel?> GetDisciplinaById(int id);
        public Task<List<DisciplinaModel>> GetAllDisciplina();
    }
}
