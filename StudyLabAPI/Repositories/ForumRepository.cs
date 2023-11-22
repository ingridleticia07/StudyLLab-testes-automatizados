using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Context;
using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public class ForumRepository : IForumRepository
    {
        private AppDbContext dbContext { get; }
        public ForumRepository(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task CreateForum(ForumModel forum) =>
             await dbContext.forum.AddAsync(forum);

        public async Task UpdateForum(ForumModel forumModel)
        {
            ForumModel forumForUpdate = await dbContext.forum.FindAsync(forumModel.idForum);

            if (forumForUpdate == null)
            {
                return;
            }
            forumForUpdate.respostaForum = forumModel.respostaForum;
            forumForUpdate.topicoDiscussao = forumModel.topicoDiscussao;
            forumForUpdate.usuario = forumModel.usuario;
        }

        public async Task<List<ForumModel>> GetAllForums()
        {
            List<ForumModel> forumModel = await dbContext.forum
            .Include(value => value.respostaForum).Include(value => value.topicoDiscussao)
            .Include(value => value.topicoDiscussao).Include(value => value.usuario).Include(value => value.respostaForum.topicoDiscussao.disciplina)
            .ToListAsync();
            return forumModel;
        }

        public async Task<bool> VerifyForumCreated(ForumModel forum)
        {
            //TODO: Provavelmente usar AnyAsync seja melhor
            bool existingForum = await dbContext.forum
                .Where(value => (value.respostaForum == forum.respostaForum &&
                    value.topicoDiscussao == forum.topicoDiscussao))
                .AnyAsync();

            return existingForum;
        }

        public async Task<bool> VerifyForumCreatedWithId(ForumModel forum)
        {
            //TODO: Provavelmente usar AnyAsync seja melhor
            bool existingForum = await dbContext.forum
                .Where(value => (value.respostaForum == forum.respostaForum &&
                    value.topicoDiscussao == forum.topicoDiscussao) && value.idForum == forum.idForum)
                .AnyAsync();

            return existingForum;
        }

        public async Task DeleteForum(int idForum)
        {
            ForumModel forumModel = await dbContext.forum.FindAsync(idForum);
            if (forumModel != null)
            {
                dbContext.forum.Remove(forumModel);
            }
        }


        public async Task Flush() =>
          await dbContext.SaveChangesAsync();
    }
}
