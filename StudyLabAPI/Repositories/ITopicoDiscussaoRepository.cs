using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public interface ITopicoDiscussaoRepository
    {
        public Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussao();



        public Task<bool> VerifyTopicoDiscussaoExists(TopicoDiscussaoModel topicoDiscussao);

        public Task<bool> VerifyTopicoDiscussaoExistsWithId(TopicoDiscussaoModel topicoDiscussao);

        public Task CreateTopicoDiscussao(TopicoDiscussaoModel topicoDiscussao);

        public Task UpdateTopicoDiscussao(TopicoDiscussaoModel topicoDiscussao);

        public Task DeleteTopicoDiscussao(int idTopicoDiscussao);
        public Task Flush();
    }
}
