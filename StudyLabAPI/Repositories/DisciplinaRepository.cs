using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Context;
using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public class DisciplinaRepository : IDisciplinaRepository
    {
        private AppDbContext dbContext{get;}
        public DisciplinaRepository(AppDbContext dbContext) {
            this.dbContext = dbContext;
        }

        public async Task<DisciplinaModel?> GetDisciplinaById(int id) =>
            await dbContext.disciplinas.FindAsync(id);
        public async Task<List<DisciplinaModel>> GetAllDisciplinas()
        {
            List<DisciplinaModel> disciplinaModel = await dbContext.disciplinas
            .Include(d => d.curso)
            .ToListAsync();
            return disciplinaModel;
        }
        public async Task CreateDisciplina(DisciplinaModel disciplinaModel) =>
            await dbContext.disciplinas.AddAsync(disciplinaModel);
        public async Task DeleteDisciplina(int idDisciplina)
        {
            var disciplinaModel = await dbContext.disciplinas.FindAsync(idDisciplina);

            if (disciplinaModel != null)
            {
                dbContext.disciplinas.Remove(disciplinaModel);
            }
        }

        public async Task Flush() =>
            await dbContext.SaveChangesAsync();
    }
}
