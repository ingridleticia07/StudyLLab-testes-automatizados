using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Context;
using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public class RespostaForumRepository : IRespostaForumRepository
    {
        private AppDbContext dbContext { get; }

        private readonly IDbContextFactory<AppDbContext> _dbContextFactory;

        public RespostaForumRepository(AppDbContext dbContext, IDbContextFactory<AppDbContext> dbContextFactory)
        {
            this.dbContext = dbContext;
            _dbContextFactory = dbContextFactory;
        }
        public async Task CreateRespostaForum(RespostaForumModel respostaForum)
        {
            await dbContext.respostaForum.AddAsync(respostaForum);
        }

        public async Task DeleteRespostaForum(int idRespostaForum)
        {
            var respostaForumModel = await dbContext.respostaForum.FindAsync(idRespostaForum);

            if (respostaForumModel != null)
            {
                dbContext.respostaForum.Remove(respostaForumModel);
            }
        }

        public async Task<List<RespostaForumModel?>> GetAllRespostasForum()
        {
            List<RespostaForumModel> respostaForumLista = await dbContext.respostaForum.
                Include(values => values.topicoDiscussao).Include(values => values.usuario).ToListAsync();

            return respostaForumLista;
        }

        public async Task<RespostaForumModel?> GetRespostaForumById(int id) =>
            await dbContext.respostaForum.FindAsync(id);

        public async Task UpdateRespostaForum(RespostaForumModel respostaForum)
        {
            RespostaForumModel respostaForumForUpdate = await dbContext.respostaForum.FindAsync(respostaForum.idResposta);
            if (respostaForumForUpdate == null)
            {
                return;
            }
            respostaForumForUpdate.resposta = respostaForum.resposta;
            respostaForumForUpdate.dataResposta = respostaForum.dataResposta;
            respostaForumForUpdate.usuario = respostaForum.usuario;
            respostaForumForUpdate.topicoDiscussao = respostaForum.topicoDiscussao;

        }

        public async Task<bool> VerifyRespostaForumExists(RespostaForumModel respostaForum)
        {
            //TODO: Provalvemente seja melhor usa AnyAsync
            bool existingRespostaForum = await dbContext.respostaForum
                .Where(value => value.resposta == respostaForum.resposta)
                .AnyAsync();

            return existingRespostaForum;
        }
        //TODO: Mesma coisa do GetRespostaForumById?
        public async Task<bool> VerifyRespostaForumExistsWithId(RespostaForumModel respostaForum)
        {
            bool existingRespostaForum = await dbContext.respostaForum.Where(value => 
            (value.resposta == respostaForum.resposta && value.topicoDiscussao == respostaForum.topicoDiscussao)
            && (value.idResposta != respostaForum.idResposta)).AnyAsync();

            return existingRespostaForum;       
        }

        private async Task<IList<RespostaForumModel>> GetRespostaForumWFactory(int page, int pageSize, int? idDisciplina, int? idTopico)
        {
            await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

            if (inDbContext is null)
                throw new("Was not possible to instanciaite a new DbContext");

            return await GetAllRespostaForumDiscussao(inDbContext, page, pageSize,idDisciplina, idTopico);
        }

        private async Task<int> GetRespostaForumCountWFactory(int? idTopico, int? idDisciplina)
        {
            await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

            if (inDbContext is null)
                throw new("Was not possible to instanciaite a new DbContext");

            return await GetRespostaForumAndCount(inDbContext, idTopico, idDisciplina);
        }

        private async Task<int> GetRespostaForumAndCount(AppDbContext inDbContext, int ?idTopico, int? idDisciplina)
        {
            int count = 0;

            if(idTopico!=0 || idDisciplina != 0)
                count = await inDbContext.respostaForum.Where(f => f.topicoDiscussao.idTopico == idTopico || f.topicoDiscussao.disciplina.idDisciplina == idDisciplina).CountAsync();

            else if(idTopico!=0 && idDisciplina!=0)
                count = await inDbContext.respostaForum.Where(f => f.topicoDiscussao.idTopico == idTopico && f.topicoDiscussao.disciplina.idDisciplina == idDisciplina).CountAsync();
            else
                count = await inDbContext.respostaForum.CountAsync();

            return count;
        }

        public Task<IList<RespostaForumModel>> GetAllRespostaForumDiscussao(int page, int pageSize, int? idDisciplina, int? idTopico) =>
                GetAllRespostaForumDiscussao(dbContext, page, pageSize,idDisciplina,idTopico);
        public async Task<IList<RespostaForumModel>> GetAllRespostaForumDiscussao(AppDbContext inDbContext,int page, int pageSize, int? idDisciplina, int? idTopico)
        {
            var result = new List<RespostaForumModel>();

            if (idDisciplina !=0 && idTopico != 0)
            {
                result = await inDbContext.respostaForum
                .AsNoTracking()
                .Where(f => f.topicoDiscussao.idTopico == idTopico && f.topicoDiscussao.disciplina.idDisciplina == idDisciplina)
                .OrderByDescending(f => f.idResposta)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(f => f.topicoDiscussao)
                .ThenInclude(td => td.disciplina)
                .Include(f => f.usuario)
                .ToListAsync();
            }
            else if(idDisciplina != 0 || idTopico != 0)
            {
                result = await inDbContext.respostaForum
                .AsNoTracking()
                .Where(f => f.topicoDiscussao.idTopico == idTopico || f.topicoDiscussao.disciplina.idDisciplina == idDisciplina)
                .OrderByDescending(f => f.idResposta)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(f => f.topicoDiscussao)
                .ThenInclude(td => td.disciplina)
                .Include(f => f.usuario)
                .ToListAsync();

            }
            else
            {
                result = await inDbContext.respostaForum
                .AsNoTracking()
                .OrderByDescending(f => f.idResposta)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(f => f.topicoDiscussao)
                .ThenInclude(td => td.disciplina)
                .Include(f => f.usuario)
                .ToListAsync();
            }

            return result;
        }

        public async Task<(IList<RespostaForumModel>, int, int)> GetRespostaForumAndCount(int page, int pageSize, int? idDisciplina, int? idTopico)
        {
            var respostasTask = GetRespostaForumWFactory(page, pageSize,idDisciplina, idTopico);
            var respostasCountTask = GetRespostaForumCountWFactory(idTopico, idDisciplina);
            await Task.WhenAll(respostasTask, respostasCountTask);

            var result = respostasTask.Result;
            int topicosCount = respostasCountTask.Result;
            return (result, result.Count, topicosCount);
        }

        public async Task Flush() =>
           await dbContext.SaveChangesAsync();
    }
}
