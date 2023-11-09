using StudyLabAPI.Models;
namespace StudyLabAPI.Controllers
{
    public interface IForumController
    {
        public Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussao();
    }
}
