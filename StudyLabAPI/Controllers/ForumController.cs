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

        private IDisciplinaRepository DisciplinaRepository { get; }

        public ForumController(ITopicoDiscussaoRepository topicoDiscussaoRepository, IDisciplinaRepository DisciplinaRepository,
            ILogger logger)
        {
            this.topicoDiscussaoRepository = topicoDiscussaoRepository;
            this.logger = logger;
            this.DisciplinaRepository = DisciplinaRepository;
        }
        public async Task<List<TopicoDiscussaoModel>> GetAllTopicosDiscussao()
        {
            // Implement your logic to get all DisciplinaModel objects
            // You can use your repository to fetch the data
            List<TopicoDiscussaoModel> topicosDiscussaoListado = await topicoDiscussaoRepository.GetAllTopicosDiscussao();
            // You should map DisciplinaModel to DisciplinaReadModel and return the list

            return topicosDiscussaoListado;
        }
        public async Task<TopicoDiscussaoModel> CreateTopicoDiscussao(RegisteredTopicoDiscussaoRequestModel topicoDiscussao)
        {
            //passar id 
            int disciplinaId = topicoDiscussao.disciplina;

            DisciplinaModel? relatedDisciplina = await DisciplinaRepository.GetDisciplinaById(disciplinaId);

            TopicoDiscussaoModel NovotopicoDiscussao = new()
            {
                nomeTopico = topicoDiscussao.nomeTopico,
                dataTopico = topicoDiscussao.dataTopico,
                disciplina = relatedDisciplina
            };
            await topicoDiscussaoRepository.CreateTopicoDiscussao(NovotopicoDiscussao);

            await topicoDiscussaoRepository.Flush();

            return (NovotopicoDiscussao);
        }
    }
}
