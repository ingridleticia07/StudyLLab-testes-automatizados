using StudyLabAPI.Models;

namespace StudyLabAPI.Controllers
{
    public interface IForumController
    {
        public Task<TopicoDiscussaoListResponse?> GetTopicosDiscussaoLimitedByPageAndPageSize(int page, int pageSize);

        public Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussao();

        public Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussaoByDisciplina(int idDisciplina);

        public Task<RespostaForumListResponse?> GetAllRespostasForumByDisciplinaOrTopico(int page, int pageSize, int? idDisciplina, int? idTopico);

        public Task<TopicoDiscussaoModel> CreateTopicoDiscussao(RegisteredTopicoDiscussaoRequestModel topicoDiscussao);

        public Task<TopicoDiscussaoModel> UpdateTopicoDiscussao(RegisteredTopicoDiscussaoRequestModel topicoDiscussaoModel);

        public Task<bool> VerifyTopicoDiscussaoExists(RegisteredTopicoDiscussaoRequestModel topicoDiscussao);

        public Task<bool> VerifyTopicoDiscussaoExistsWithId(RegisteredTopicoDiscussaoRequestModel topicoDiscussao);

        public Task DeleteTopicoDiscussao(int idTopicoDiscussao);

        public Task<List<RespostaForumModel?>> GetAllRespostasForum();

        public Task<bool> VerifyRespostaForumExists(RegisteredRespostaForumModel respostaForum);

        public Task<bool> VerifyRespostaForumExistsWithId(RegisteredRespostaForumModel respostaForum);

        public Task<RegisteredRespostaForumModel> CreateRespostaForum(RegisteredRespostaForumModel respostaForum);

        public Task<RespostaForumModel> UpdateRespostaForum(RegisteredRespostaForumModel respostaForum);

        public Task DeleteRespostaForum(RespostaForumModel respostaForum);

        public Task<ForumModel> CreateForum(ResgisteredForumModel respostaForum);

        public Task<ForumModel> UpdateForum(ResgisteredForumModel updateForum);

        public Task<List<ForumModel?>> GetAllForums();

        public Task DeleteForum(ForumModel forum);

        public Task<bool> VerifyForumCreated(ResgisteredForumModel forum);
 
        public Task<bool> VerifyForumCreatedWithId(ResgisteredForumModel forum);

        public Task<List<ForumModel?>> GetForumByTopico(RegisteredTopicoDiscussaoRequestModel topico);
    }
}
