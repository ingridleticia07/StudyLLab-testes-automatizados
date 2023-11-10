using StudyLabAPI.Models;
namespace StudyLabAPI.Controllers
{
    public interface IForumController
    {
        public Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussao();

        public Task<TopicoDiscussaoModel> CreateTopicoDiscussao(RegisteredTopicoDiscussaoRequestModel topicoDiscussao);

        public Task<TopicoDiscussaoModel> UpdateTopicoDiscussao(RegisteredTopicoDiscussaoRequestModel topicoDiscussaoModel);
        }
}
