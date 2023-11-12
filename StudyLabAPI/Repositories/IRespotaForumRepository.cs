using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public interface IRespotaForumRepository
    {
        public Task<List<RespostaForumModel?>> GetAllRespostasForum();

        public Task<bool> VerifyRespostaForumExists(RespostaForumModel respostaForum);

        public Task<bool> VerifyRespostaForumExistsWithId(RespostaForumModel respostaForum);

        public Task CreateRespostaForum(RespostaForumModel respostaForum);

        public Task UpdateRespostaForum(RespostaForumModel respostaForum);

        public Task DeleteRespostaForum(int idRespostaForum);
        public Task Flush();
    }
}
