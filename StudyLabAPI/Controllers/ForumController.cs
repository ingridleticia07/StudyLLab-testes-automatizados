using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Models;
using ILogger = Serilog.ILogger;
using StudyLabAPI.Repositories;

namespace StudyLabAPI.Controllers
{
    public class ForumController : IForumController
    {
        private ITopicoDiscussaoRepository topicoDiscussaoRepository { get; }
        private ILogger logger { get; }

        private ICursoRepository cursoRepository { get; }

        public ForumController(ITopicoDiscussaoRepository topicoDiscussaoRepository, ICursoRepository cursoRepository,
            ILogger logger)
        {
            this.topicoDiscussaoRepository = topicoDiscussaoRepository;
            this.logger = logger;
            this.cursoRepository = cursoRepository;
        }
        public async Task<List<TopicoDiscussaoModel>> GetAllTopicosDiscussao()
        {
            // Implement your logic to get all DisciplinaModel objects
            // You can use your repository to fetch the data
            List<TopicoDiscussaoModel> topicosDiscussaoListado = await topicoDiscussaoRepository.GetAllTopicosDiscussao();
            // You should map DisciplinaModel to DisciplinaReadModel and return the list

            return topicosDiscussaoListado;
        }
    }
}
