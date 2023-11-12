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


        public async Task<bool> VerifyTopicoDiscussaoExists(RegisteredTopicoDiscussaoRequestModel topicoDiscussao)
        {
            TopicoDiscussaoModel topicoDiscussaoModel = new()
            {
                idTopico = topicoDiscussao.idTopico,
                nomeTopico = topicoDiscussao.nomeTopico,
                dataTopico = topicoDiscussao.dataTopico
            };
            bool returnCheckTopicoDiscussaoExists = await topicoDiscussaoRepository.VerifyTopicoDiscussaoExists(topicoDiscussaoModel);
            return returnCheckTopicoDiscussaoExists;
        }

        public async Task<bool> VerifyTopicoDiscussaoExistsWithId(RegisteredTopicoDiscussaoRequestModel topicoDiscussao)
        {
            TopicoDiscussaoModel topicoDiscussaoModel = new()
            {
                idTopico = topicoDiscussao.idTopico,
                nomeTopico = topicoDiscussao.nomeTopico,
                dataTopico = topicoDiscussao.dataTopico
            };
            bool returnCheckTopicoDiscussaoExists = await topicoDiscussaoRepository.VerifyTopicoDiscussaoExistsWithId(topicoDiscussaoModel);
            return returnCheckTopicoDiscussaoExists;
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

        public async Task<TopicoDiscussaoModel> UpdateTopicoDiscussao(RegisteredTopicoDiscussaoRequestModel topicoDiscussaoModel)
        {
            int disciplinaId = topicoDiscussaoModel.disciplina;

            DisciplinaModel? relatedDisciplina = await DisciplinaRepository.GetDisciplinaById(disciplinaId);

            TopicoDiscussaoModel NovotopicoDiscussao = new()
            {
                idTopico = topicoDiscussaoModel.idTopico,
                nomeTopico = topicoDiscussaoModel.nomeTopico,
                dataTopico = topicoDiscussaoModel.dataTopico,
                disciplina = relatedDisciplina
            };
            await topicoDiscussaoRepository.UpdateTopicoDiscussao(NovotopicoDiscussao);
            await topicoDiscussaoRepository.Flush();

            return (NovotopicoDiscussao);
        }

        public async Task DeleteTopicoDiscussao(TopicoDiscussaoModel topicoDiscussao)
        {
            //verificar se disciplina existe, por meio do buscar disciplina
            //para em caso de exstir, excluir a mesma
            await topicoDiscussaoRepository.DeleteTopicoDiscussao(topicoDiscussao.idTopico);
            await topicoDiscussaoRepository.Flush();
        }
    }
}
