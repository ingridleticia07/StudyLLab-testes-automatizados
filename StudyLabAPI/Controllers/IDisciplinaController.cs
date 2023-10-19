using StudyLabAPI.Models;

namespace StudyLabAPI.Controllers
{
    public interface IDisciplinaController
    {
        public Task<DisciplinaReadModel> GetDisciplinaById(int id);
        public Task<List<DisciplinaReadModel>> GetAllDisciplinas();
        public Task<(DisciplinaReadModel, string)> CreateDisciplina(RegisterDisciplinaRequestModel disciplinaModel);

    }
}
