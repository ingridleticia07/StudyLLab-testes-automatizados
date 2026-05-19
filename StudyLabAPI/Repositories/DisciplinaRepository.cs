using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Context;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Curso;
using StudyLabAPI.Models.Disciplina;

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

        public async Task<List<DisciplinaModel?>> GetAllDisciplinas() =>
            await _dbContext.disciplinas.ToListAsync();

        private async Task<IList<DisciplinaModel>> GetDisciplinasWFactory(int page, int pageSize, int idCurso)
        {
            await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

            if (inDbContext is null)
                throw new("Was not possible to instanciaite a new DbContext");

            return await GetAllDisciplinasWithPagination(inDbContext, page, pageSize, idCurso);
        }

        private async Task<int> GetDisciplinasCountWFactory(int idCurso)
        {
            await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

            if (inDbContext is null)
                throw new("Was not possible to instanciaite a new DbContext");

            return await GetDisciplinasCount(inDbContext, idCurso);
        }

        public async Task<DisciplinaModel?> GetDisciplinaById(int id)
        {
            var disciplina = await _dbContext.disciplinas.AsNoTracking()
                .Where(v => v.idDisciplina == id).Select(f => new DisciplinaModel
                {
                    idDisciplina = f.idDisciplina,
                    nomeDisciplina = f.nomeDisciplina,
                    professorDisciplina = f.professorDisciplina,
                    quantidadeAluno = f.quantidadeAluno,
                    codigoDisciplina = f.codigoDisciplina,
                    curso = new CursoModel
                    {
                        idCurso = f.curso.idCurso,
                        nomeCurso = f.curso.nomeCurso
                    }
                }).FirstOrDefaultAsync();

            return disciplina;
        }

        public async Task<DisciplinaModel?> GetDisciplinaByIdForUpdateTopico(int id, bool includeProfessor = false)
        {
            DisciplinaModel disciplinaModel = null;

            if (includeProfessor)
                disciplinaModel = await _dbContext.disciplinas.Where(v => v.idDisciplina == id).FirstOrDefaultAsync();
            else
                disciplinaModel = await _dbContext.disciplinas.FindAsync(id);

            return disciplinaModel;
        }

        public async Task<bool> VerifyDisciplinaCreated(DisciplinaModel disciplina)
        {
            bool existingDisciplina = await _dbContext.disciplinas
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

        private async Task<int> GetDisciplinasCount(AppDbContext inDbContext, int idCurso)
        {
            int countDisciplinas = 0;
            
            if(idCurso == 0)
                countDisciplinas = await inDbContext.disciplinas.CountAsync();
            else
                countDisciplinas = await inDbContext.disciplinas.Where(f => f.curso.idCurso == idCurso).CountAsync();

            return countDisciplinas;
        }


        public async Task<(IList<DisciplinaModel>, int, int)> GetDisciplinasAndCount(int page, int pageSize, int idCurso)
        {
            var disciplinaTask = GetDisciplinasWFactory(page, pageSize, idCurso);
            var disciplinaCountTask = GetDisciplinasCountWFactory(idCurso);
            await Task.WhenAll(disciplinaTask, disciplinaCountTask);

            var result = disciplinaTask.Result;
            int disciplinaCount = disciplinaCountTask.Result;
            return (result, result.Count, disciplinaCount);
        }

        public Task<IList<DisciplinaModel>> GetAllDisciplinasWithPagination(int page, int pageSize, int idCurso) =>
            GetAllDisciplinasWithPagination(_dbContext, page, pageSize, idCurso);

        public async Task<IList<DisciplinaModel>> GetAllDisciplinasWithPagination(AppDbContext inDbContext, int page, int pageSize, int idCurso)
        {
            IQueryable<DisciplinaModel> query = inDbContext.disciplinas
                .AsNoTracking()
                .OrderBy(f => f.nomeDisciplina);

            if (idCurso != 0)
            {
                query = query.Where(f => f.curso.idCurso == idCurso);
            }

            var result = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(f => new DisciplinaModel
                {
                    idDisciplina = f.idDisciplina,
                    nomeDisciplina = f.nomeDisciplina,
                    professorDisciplina = f.professorDisciplina,
                    quantidadeAluno = f.quantidadeAluno,
                    codigoDisciplina = f.codigoDisciplina,
                    curso = new CursoModel
                    {
                        idCurso = f.curso.idCurso,
                        nomeCurso = f.curso.nomeCurso
                    }
                })
                .ToListAsync();

            return result;
        }

        public async Task CreateDisciplina(DisciplinaModel disciplinaModel) =>
            await _dbContext.disciplinas.AddAsync(disciplinaModel);

        public async Task UpdateDisciplina(DisciplinaModel disciplinaModel)
        {
            DisciplinaModel? disciplinaForUpdate = await _dbContext.disciplinas.FindAsync(disciplinaModel.idDisciplina);

            if (disciplinaForUpdate == null)
            {
                return;
            }

            disciplinaForUpdate.nomeDisciplina = disciplinaModel.nomeDisciplina;
            disciplinaForUpdate.professorDisciplina = disciplinaModel.professorDisciplina;
            disciplinaForUpdate.curso = disciplinaModel.curso;
            disciplinaForUpdate.quantidadeAluno = disciplinaModel.quantidadeAluno;
            disciplinaForUpdate.codigoDisciplina = disciplinaModel.codigoDisciplina;
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
