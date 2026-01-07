using StudyLabAPI.Models;
using StudyLabAPI.Models.Forum;

namespace StudyLabAPI.Repositories
{
    public interface IForumRepository
    {
        public Task CreateForum(ForumModel Forum);

        public Task UpdateForum(ForumModel ForumUpdate);

        public Task<List<ForumModel?>> GetAllForums();

        public Task<List<ForumModel?>> GetForumByTopico(TopicoDiscussaoModel topico);

        public Task<bool> VerifyForumCreated(ForumModel Forum);

        public Task<bool> VerifyForumCreatedWithId(ForumModel Forum);
        public Task DeleteForum(int idForum);
        public Task Flush();
    }
}
