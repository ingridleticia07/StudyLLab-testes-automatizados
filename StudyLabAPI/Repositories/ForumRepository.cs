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

        public async Task Flush() =>
          await dbContext.SaveChangesAsync();
    }
}
