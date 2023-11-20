using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public interface IForumRepository
    {
        public Task CreateForum(ForumModel Forum);

        public Task UpdateForum(ForumModel ForumUpdate);

        public Task Flush();
    }
}
