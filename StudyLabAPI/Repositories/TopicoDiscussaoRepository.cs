using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Context;
using StudyLabAPI.Models;

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

        private async Task<IList<TopicoDiscussaoModel>> GetTopicoWFactory(int page, int pageSize)
        {
            await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

            if (inDbContext is null)
                throw new("Was not possible to instanciaite a new DbContext");

            return await GetTopicosDiscussaoLimitedByPageAndPageSize(inDbContext, page, pageSize);
        }

        private async Task<int> GetTopicosCountWFactory()
        {
            await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

            if (inDbContext is null)
                throw new("Was not possible to instanciaite a new DbContext");

            return await GetTopicosAndCount(inDbContext);
        }

        private async Task<int> GetTopicosAndCount(AppDbContext inDbContext) =>
            await inDbContext.discussao.CountAsync();

        public Task<IList<TopicoDiscussaoModel>> GetTopicosDiscussaoLimitedByPageAndPageSize(int page, int pageSize) =>
                GetTopicosDiscussaoLimitedByPageAndPageSize(dbContext, page, pageSize);
        public async Task<IList<TopicoDiscussaoModel>> GetTopicosDiscussaoLimitedByPageAndPageSize(AppDbContext inDbContext, int page, int pageSize)
        {
            var result = await inDbContext.discussao
            .AsNoTracking()
            .OrderBy(f => f.idTopico)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(f => f.disciplina)
            .Include(f => f.usuario)
            .ToListAsync();

            return result;
        }

        public async Task<(IList<TopicoDiscussaoModel>, int, int)> GetTopicosAndCount(int page, int pageSize)
        {
            var topicosTask = GetTopicoWFactory(page, pageSize);
            var topicosCountTask = GetTopicosCountWFactory();
            await Task.WhenAll(topicosTask, topicosCountTask);

            var result = topicosTask.Result;
            int topicosCount = topicosCountTask.Result;
            return (result, result.Count, topicosCount);
        }

        public async Task<TopicoDiscussaoModel?> GetTopicosDiscussaoById(int id) =>
            await dbContext.discussao.Where(v => v.idTopico == id).Include(v => v.usuario).Include(v => v.disciplina).FirstOrDefaultAsync();

        public async Task<bool> VerifyTopicoDiscussaoExists(TopicoDiscussaoModel topicoDiscussao)
        {
            //TODO: Provalvemente seja melhor usa AnyAsync
            var existingTopicoDiscussao = await dbContext.discussao
                .Where(QueryValue => QueryValue.nomeTopico == topicoDiscussao.nomeTopico)
                .AnyAsync();

            return existingTopicoDiscussao;
        }

        //TODO: Mesma coisa do GetTopicosDiscussaoById
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
