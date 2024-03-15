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

        public async Task<DisciplinaModel?> GetDisciplinaById(int id)
        {
            var disciplina = await dbContext.disciplinas.FindAsync(id);

            if (disciplina != null)
            {
                await dbContext.Entry(disciplina)
                    .Reference(d => d.curso)
                    .LoadAsync();
            }

            return disciplina;
        }

        public async Task<bool> VerifyDisciplinaCreated(DisciplinaModel disciplina)
        {
            bool existingDisciplina = await dbContext.disciplinas
                .AnyAsync(d => d.nomeDisciplina == disciplina.nomeDisciplina || 
                               d.codigoDisciplina == disciplina.codigoDisciplina);

            return existingDisciplina;
        }
        
        //TODO: Mesma coisa do GetDisciplinaById?
        public async Task<bool> VerifyDisciplinaCreatedWithId(int disciplinaIdentifier)
        {
            bool existingDisciplina = await dbContext.disciplinas
                .AnyAsync(d => d.idDisciplina == disciplinaIdentifier);

            return existingDisciplina;
        }
        public async Task<List<DisciplinaModel>> GetAllDisciplinas()
        {
            List<DisciplinaModel> disciplinaModel = await dbContext.disciplinas
            .Include(d => d.curso)
            .ToListAsync();
            return disciplinaModel;
        }
        public async Task CreateDisciplina(DisciplinaModel disciplinaModel) =>
            await dbContext.disciplinas.AddAsync(disciplinaModel);

        public async Task UpdateDisciplina(DisciplinaModel disciplinaModel)
        {
            DisciplinaModel? disciplinForUpdate = await dbContext.disciplinas.FindAsync(disciplinaModel.idDisciplina);

            if (disciplinForUpdate == null)
            {
                return;
            }
            disciplinForUpdate.nomeDisciplina = disciplinaModel.nomeDisciplina;
            disciplinForUpdate.professorDisciplina = disciplinaModel.professorDisciplina;
            disciplinForUpdate.curso = disciplinaModel.curso;
            disciplinForUpdate.quantidadeAluno = disciplinaModel.quantidadeAluno;
            disciplinForUpdate.codigoDisciplina = disciplinaModel.codigoDisciplina;
        }

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
