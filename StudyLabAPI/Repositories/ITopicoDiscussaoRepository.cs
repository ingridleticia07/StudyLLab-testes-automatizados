using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public interface ITopicoDiscussaoRepository
    {
        public Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussao();
    }
}
