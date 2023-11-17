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

        public async Task Flush() =>
          await dbContext.SaveChangesAsync();
    }
}
