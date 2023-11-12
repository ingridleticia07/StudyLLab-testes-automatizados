using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Context;
using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public class RespostaForumRepository : IRespostaForumRepository
    {
        private AppDbContext dbContext { get; }
        public RespostaForumRepository(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
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

        public async Task Flush() =>
           await dbContext.SaveChangesAsync();

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
            var respostaForumModel = await dbContext.respostaForum.FindAsync(respostaForum.idResposta);
            if (respostaForumModel != null)
            {
                return;
            }
            respostaForumModel.resposta = respostaForum.resposta;
            respostaForumModel.dataResposta = respostaForum.dataResposta;
            respostaForumModel.usuario = respostaForum.usuario;
            respostaForumModel.topicoDiscussao = respostaForum.topicoDiscussao;
        }

        public async Task<bool> VerifyRespostaForumExists(RespostaForumModel respostaForum)
        {
            var existingRespostaForum = await dbContext.respostaForum
                .Where(value => (value.resposta == respostaForum.resposta) && 
                (value.idResposta != respostaForum.idResposta))
                .FirstOrDefaultAsync();

            return existingRespostaForum != null;
        }

        public async Task<bool> VerifyRespostaForumExistsWithId(RespostaForumModel respostaForum)
        {
            var existingRespostaForum = dbContext.respostaForum.Where(value => (value.resposta == respostaForum.resposta)
            && (value.idResposta != respostaForum.idResposta));

            return existingRespostaForum != null;
        }
    }
}
