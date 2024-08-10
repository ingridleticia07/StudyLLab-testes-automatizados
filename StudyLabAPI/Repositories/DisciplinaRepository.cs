using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Context;
using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public class DisciplinaRepository : IDisciplinaRepository
    {
        private readonly AppDbContext _dbContext;

        private readonly IDbContextFactory<AppDbContext> _dbContextFactory;
        public DisciplinaRepository(AppDbContext dbContext, IDbContextFactory<AppDbContext> dbContextFactory)
        {
            _dbContext = dbContext;
            _dbContextFactory = dbContextFactory;
        }

        private async Task<IList<DisciplinaModel>> GetDisciplinasWFactory(int page, int pageSize)
        {
            await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

            if (inDbContext is null)
                throw new("Was not possible to instanciaite a new DbContext");

            return await GetAllDisciplinas(inDbContext, page, pageSize);
        }

        private async Task<int> GetDisciplinasCountWFactory()
        {
            await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

            if (inDbContext is null)
                throw new("Was not possible to instanciaite a new DbContext");

            return await GetDisciplinasCount(inDbContext);
        }

        public async Task<DisciplinaModel?> GetDisciplinaById(int id)
        {
            var disciplina = await _dbContext.disciplinas.FindAsync(id);

            if (disciplina != null)
            {
                await _dbContext.Entry(disciplina)
                    .Reference(d => d.curso)
                    .LoadAsync();
            }

            return disciplina;
        }

        public async Task<bool> VerifyDisciplinaCreated(DisciplinaModel disciplina)
        {
            bool existingDisciplina =  await _dbContext.disciplinas
            .AnyAsync(d =>
            (d.nomeDisciplina == disciplina.nomeDisciplina ||
             d.codigoDisciplina == disciplina.codigoDisciplina) &&
             d.idDisciplina != disciplina.idDisciplina);

            return existingDisciplina;
        }

        //TODO: Mesma coisa do GetDisciplinaById?
        public async Task<bool> VerifyDisciplinaCreatedWithId(int disciplinaIdentifier)
        {
            bool existingDisciplina = await _dbContext.disciplinas
                .AnyAsync(d => d.idDisciplina == disciplinaIdentifier);

            return existingDisciplina;
        }

        private async Task<int> GetDisciplinasCount(AppDbContext inDbContext) =>
            await inDbContext.disciplinas.CountAsync();


        public async Task<(IList<DisciplinaModel>, int, int)> GetDisciplinasAndCount(int page, int pageSize)
        {
            var disciplinaTask = GetDisciplinasWFactory(page, pageSize);
            var disciplinaCountTask = GetDisciplinasCountWFactory();
            await Task.WhenAll(disciplinaTask, disciplinaCountTask);

            var result = disciplinaTask.Result;
            int disciplinaCount = disciplinaCountTask.Result;
            return (result, result.Count, disciplinaCount);
        }

        public Task<IList<DisciplinaModel>> GetAllDisciplinas(int page, int pageSize) =>
            GetAllDisciplinas(_dbContext, page, pageSize);

        public async Task<IList<DisciplinaModel>> GetAllDisciplinas(AppDbContext inDbContext, int page, int pageSize)
        {
            var result = await inDbContext.disciplinas
            .AsNoTracking()
            .OrderBy(f => f.idDisciplina)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(f => f.curso)
            .ToListAsync();

            return result;
        }
        public async Task CreateDisciplina(DisciplinaModel disciplinaModel) =>
            await _dbContext.disciplinas.AddAsync(disciplinaModel);

        public async Task UpdateDisciplina(DisciplinaModel disciplinaModel)
        {
            DisciplinaModel? disciplinForUpdate = await _dbContext.disciplinas.FindAsync(disciplinaModel.idDisciplina);

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
            var disciplinaModel = await _dbContext.disciplinas.FindAsync(idDisciplina);

            if (disciplinaModel != null)
            {
                _dbContext.disciplinas.Remove(disciplinaModel);
            }
        }

        public async Task Flush() =>
            await _dbContext.SaveChangesAsync();
    }
}
