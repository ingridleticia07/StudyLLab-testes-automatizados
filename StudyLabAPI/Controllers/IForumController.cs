using StudyLabAPI.Models;
using System.Threading.Tasks;

namespace StudyLabAPI.Controllers
{
    public interface IForumController
    {
        public Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussao();

        public Task<TopicoDiscussaoModel> CreateTopicoDiscussao(RegisteredTopicoDiscussaoRequestModel topicoDiscussao);

        public Task<TopicoDiscussaoModel> UpdateTopicoDiscussao(RegisteredTopicoDiscussaoRequestModel topicoDiscussaoModel);

        public Task<bool> VerifyTopicoDiscussaoExists(RegisteredTopicoDiscussaoRequestModel topicoDiscussao);

        public Task<bool> VerifyTopicoDiscussaoExistsWithId(RegisteredTopicoDiscussaoRequestModel topicoDiscussao);

        public Task DeleteTopicoDiscussao(TopicoDiscussaoModel idTopicoDiscussao);

        public Task<List<RespostaForumModel?>> GetAllRespostasForum();

        public Task<bool> VerifyRespostaForumExists(RegisteredRespostaForumModel respostaForum);

        public Task<bool> VerifyRespostaForumExistsWithId(RegisteredRespostaForumModel respostaForum);

        public Task<RegisteredRespostaForumModel> CreateRespostaForum(RegisteredRespostaForumModel respostaForum);

        public Task<RespostaForumModel> UpdateRespostaForum(RegisteredRespostaForumModel respostaForum);

        public Task DeleteRespostaForum(RespostaForumModel respostaForum);

        public Task<ForumModel> CreateForum(ResgisteredForumModel respostaForum);
    }
}
