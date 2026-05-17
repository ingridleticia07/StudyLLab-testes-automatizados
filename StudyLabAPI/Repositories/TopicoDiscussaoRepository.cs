using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Context;
using StudyLabAPI.Models;
using System.Runtime.CompilerServices;
using StudyLabAPI.Models.Disciplina;
using StudyLabAPI.Models.Forum;
using StudyLabAPI.Models.User;

namespace StudyLabAPI.Repositories
{
    public class TopicoDiscussaoRepository : ITopicoDiscussaoRepository
    {
        private AppDbContext dbContext { get; }

        private readonly IDbContextFactory<AppDbContext> _dbContextFactory;
        public TopicoDiscussaoRepository(AppDbContext dbContext, IDbContextFactory<AppDbContext> dbContextFactory)
        {
            this.dbContext = dbContext;
            _dbContextFactory = dbContextFactory;
        }

        public async Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussaoByDisciplina(int idDisciplina)
        {
            var result = new List<TopicoDiscussaoModel>();

            if (idDisciplina != 0)
            {
                result = await dbContext.discussao.Where(f => f.disciplina.idDisciplina == idDisciplina)
                .AsNoTracking()
                .ToListAsync();
            }
            else
            {
                result = await dbContext.discussao.ToListAsync();
            }

            return result;
        }

        public async Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussao() =>
            await dbContext.discussao.Include(r => r.usuario).ToListAsync();

        private async Task<IList<TopicoDiscussaoModel>> GetTopicoWFactory(int page, int pageSize, int idDisciplina = 0)
        {
            await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

            if (inDbContext is null)
                throw new("Was not possible to instanciaite a new DbContext");

            return await GetTopicosDiscussaoLimitedByPageAndPageSize(inDbContext, page, pageSize, idDisciplina);
        }

        private async Task<int> GetTopicosCountWFactory(int idDisciplina = 0)
        {
            await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

            if (inDbContext is null)
                throw new("Was not possible to instanciaite a new DbContext");

            return await GetTopicosAndCount(inDbContext, idDisciplina);
        }

        private async Task<int> GetTopicosAndCount(AppDbContext inDbContext, int idDisciplina = 0)
        {
            await inDbContext.discussao.CountAsync();
            int sizeRecords = 0;
            
            if(idDisciplina > 0)
             sizeRecords = await inDbContext.discussao.Where(f => f.disciplina.idDisciplina == idDisciplina) .CountAsync();   
            else 
                sizeRecords = await inDbContext.discussao.CountAsync();
            
            return sizeRecords;
        }

        public Task<IList<TopicoDiscussaoModel>> GetTopicosDiscussaoLimitedByPageAndPageSize(int page, int pageSize, int idDisciplina = 0) =>
                GetTopicosDiscussaoLimitedByPageAndPageSize(dbContext, page, pageSize, idDisciplina);
        
        public async Task<IList<TopicoDiscussaoModel>> GetTopicosDiscussaoLimitedByPageAndPageSize(AppDbContext inDbContext, int page, int pageSize, int idDisciplina = 0)
        {
            var query = inDbContext.discussao.AsNoTracking();

            if (idDisciplina > 0)
                query = query.Where(f => f.disciplina.idDisciplina == idDisciplina);
            
            var result = await query
                .OrderBy(f => f.idTopico)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(f => new TopicoDiscussaoModel
                {
                    idTopico = f.idTopico,
                    nomeTopico = f.nomeTopico,
                    dataTopico = f.dataTopico,
                    // popula os relacionamentos
                    disciplina = new DisciplinaModel
                    {
                        idDisciplina = f.disciplina.idDisciplina,
                        nomeDisciplina = f.disciplina.nomeDisciplina,
                        professorDisciplina = f.disciplina.professorDisciplina
                    },
                    usuario = new UsuarioModel
                    {
                        idUsuario = f.usuario.idUsuario,
                        nomeUsuario = f.usuario.nomeUsuario,
                        emailUsuario = f.usuario.emailUsuario
                    }
                }).ToListAsync();
            
            return result;
        }

        public async Task<(IList<TopicoDiscussaoModel>, int, int)> GetTopicosAndCount(int page, int pageSize, int idDisciplina = 0)
        {
            var topicosTask = GetTopicoWFactory(page, pageSize, idDisciplina);
            var topicosCountTask = GetTopicosCountWFactory(idDisciplina);
            await Task.WhenAll(topicosTask, topicosCountTask);

            var result = topicosTask.Result;
            int topicosCount = topicosCountTask.Result;
            return (result, result.Count, topicosCount);
        }

        public async Task<TopicoDiscussaoModel?> GetTopicosDiscussaoById(int id, bool isAnyAsync = false)
        {
            TopicoDiscussaoModel? topicoDiscussaoModel = null;

            if (isAnyAsync)
                topicoDiscussaoModel = await dbContext.discussao.FindAsync(id);
            else
                topicoDiscussaoModel = await dbContext.discussao.AsNoTracking().Where(v => v.idTopico == id).Include(v => v.disciplina).FirstOrDefaultAsync();

            return topicoDiscussaoModel;
        }

        public async Task<bool> VerifyTopicoDiscussaoExists(TopicoDiscussaoModel topicoDiscussao, int idDisciplina = 0)
        {
            var query = dbContext.discussao
                .Where(q => q.nomeTopico == topicoDiscussao.nomeTopico);
            
            if (idDisciplina != 0)
            {
                query = query.Where(q => q.disciplina.idDisciplina == idDisciplina);
            }
            
            var existingTopicoDiscussao = await query.AnyAsync();
            
            return existingTopicoDiscussao;
        }
        
        public async Task<bool> VerifyTopicoDiscussaoExistsWithId(TopicoDiscussaoModel topicoDiscussao)
        {
            bool existingTopicoDiscussao = await dbContext.discussao
                .Where(QueryValue => (QueryValue.nomeTopico == topicoDiscussao.nomeTopico) && 
                QueryValue.idTopico!=topicoDiscussao.idTopico)
                .AnyAsync();

            return existingTopicoDiscussao;
        }

        public async Task<bool> VerifyDisciplinaCreatedWithId(DisciplinaModel disciplina)
        {
            bool existingDisciplina = await dbContext.disciplinas
                .Where(d => (d.nomeDisciplina == disciplina.nomeDisciplina ||
                    d.codigoDisciplina == disciplina.codigoDisciplina) && d.idDisciplina != disciplina.idDisciplina)
                .AnyAsync();

            return existingDisciplina;
        }

        public async Task CreateTopicoDiscussao(TopicoDiscussaoModel topicoDiscussao) =>
            await dbContext.discussao.AddAsync(topicoDiscussao);

        public async Task UpdateTopicoDiscussao(TopicoDiscussaoModel topicoDiscussaoModel)
        {
            TopicoDiscussaoModel topicoDiscussaoForUpdate = await dbContext.discussao.FindAsync(topicoDiscussaoModel.idTopico);

            if (topicoDiscussaoForUpdate == null)
            {
                return;
            }

            topicoDiscussaoForUpdate.disciplina = topicoDiscussaoModel.disciplina;
            topicoDiscussaoForUpdate.dataTopico = topicoDiscussaoModel.dataTopico;
            topicoDiscussaoForUpdate.nomeTopico = topicoDiscussaoModel.nomeTopico;
        }

        public async Task DeleteTopicoDiscussao(int idTopicoDiscussao)
        {
            var topicoDiscussaoModel = await dbContext.discussao.FindAsync(idTopicoDiscussao);

            if (topicoDiscussaoModel != null)
            {
                dbContext.discussao.Remove(topicoDiscussaoModel);
            }
        }

        public async Task Flush() =>
            await dbContext.SaveChangesAsync();

    }
}
