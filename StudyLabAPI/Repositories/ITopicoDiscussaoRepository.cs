using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public interface ITopicoDiscussaoRepository
    {
        public Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussao();

        public Task CreateTopicoDiscussao(TopicoDiscussaoModel topicoDiscussao);

        public Task UpdateTopicoDiscussao(TopicoDiscussaoModel topicoDiscussao);
        public Task Flush();
    }
}
