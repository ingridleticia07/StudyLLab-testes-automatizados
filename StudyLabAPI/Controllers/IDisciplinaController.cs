using StudyLabAPI.Models;

namespace StudyLabAPI.Controllers
{
    public interface IDisciplinaController
    {
        public Task<DisciplinaReadModel> GetDisciplinaById(int id);
        public Task<List<DisciplinaReadModel>> GetAllDisciplinas();

        public Task<bool> VerifyDisciplinaCreated(RegisterDisciplinaRequestModel disciplina);

        public Task<bool> VerifyDisciplinaCreatedWithId(RegisterDisciplinaRequestModel disciplina);
        public Task<DisciplinaReadModel> CreateDisciplina(RegisterDisciplinaRequestModel disciplinaModel);

        public Task<DisciplinaReadModel> UpdateDisciplina(RegisterDisciplinaRequestModel disciplinaModel);
        public Task DeleteDisciplina(DisciplinaModel idDisciplina);
    }
}
