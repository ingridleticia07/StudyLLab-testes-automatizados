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
        public async Task<List<DisciplinaModel>> GetAllDisciplina()
        {
            List<DisciplinaModel> disciplinaModel = await dbContext.disciplinas
            .Include(d => d.curso)
            .ToListAsync();
            return disciplinaModel;
        }

    }
}
