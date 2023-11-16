using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public interface IForumRepository
    {
        public Task CreateForum(ForumModel respostaForum);

        public Task Flush();
    }
}
