using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public interface IDisciplinaRepository
    {
        public Task<DisciplinaModel?> GetDisciplinaById(int id);

        public Task<bool> VerifyDisciplinaCreated(DisciplinaModel disciplina);

        public Task<bool> VerifyDisciplinaCreatedWithId(DisciplinaModel disciplina);
        public Task<List<DisciplinaModel?>> GetAllDisciplinas();

        public Task CreateDisciplina(DisciplinaModel disciplinaModel);

        public Task UpdateDisciplina(DisciplinaModel disciplinaModel);

        public Task DeleteDisciplina(int idDisciplina);
        public Task Flush();
    }
}
