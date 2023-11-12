using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Models;
using ILogger = Serilog.ILogger;
using StudyLabAPI.Repositories;

namespace StudyLabAPI.Controllers
{
    public class ForumController : IForumController
    {
        private ITopicoDiscussaoRepository topicoDiscussaoRepository { get; }

        private IUsuarioRepository usuarioRepository { get; }
        private ILogger logger { get; }

        private IDisciplinaRepository DisciplinaRepository { get; }

        private IRespostaForumRepository respostaforumRepository { get; }

        public ForumController(ITopicoDiscussaoRepository topicoDiscussaoRepository, 
            IDisciplinaRepository DisciplinaRepository, IUsuarioRepository usuarioRepository,
            IRespostaForumRepository respostaForumRepository, ILogger logger)
        {
            this.topicoDiscussaoRepository = topicoDiscussaoRepository;
            this.DisciplinaRepository = DisciplinaRepository;
            this.usuarioRepository = usuarioRepository;
            this.respostaforumRepository = respostaForumRepository;
            this.logger = logger;
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
                dataTopico = topicoDiscussaoModel.dataTopico
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

        public async Task<List<RespostaForumModel?>> GetAllRespostasForum()
        {
            List<RespostaForumModel> RespostaForumListado = await respostaforumRepository.GetAllRespostasForum();
            // You should map DisciplinaModel to DisciplinaReadModel and return the list

            return RespostaForumListado;
        }

        public async Task<bool> VerifyRespostaForumExists(RegisteredRespostaForumModel respostaForum)
        {
            RespostaForumModel respostaForumModel = new()
            {
                idResposta = respostaForum.idResposta,
                resposta = respostaForum.resposta,
                dataResposta = respostaForum.dataResposta
            };
            bool returnCheckrespostaForumExists = await respostaforumRepository.VerifyRespostaForumExists(respostaForumModel);
            return returnCheckrespostaForumExists;
        }

        public async Task<bool> VerifyRespostaForumExistsWithId(RegisteredRespostaForumModel respostaForum)
        {
            RespostaForumModel respostaForumModel = new()
            {
                idResposta = respostaForum.idResposta,
                resposta = respostaForum.resposta,
                dataResposta = respostaForum.dataResposta
            };
            bool returnCheckrespostaForumExists = await respostaforumRepository.VerifyRespostaForumExistsWithId(respostaForumModel);
            return returnCheckrespostaForumExists;
        }

        public async Task<RegisteredRespostaForumModel> CreateRespostaForum(RegisteredRespostaForumModel respostaForum)
        {
            int topicoDiscussaoId = respostaForum.topicoDiscussao;

            int UsuarioId = respostaForum.usuario;

            TopicoDiscussaoModel? relatedTopicoDiscussao = 
                await topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoDiscussaoId);

            UsuarioModel? relatedUsuario =
                await usuarioRepository.GetUsuarioById(UsuarioId);

            RespostaForumModel NovoRespostaForum = new()
            {
                resposta = respostaForum.resposta,
                dataResposta = respostaForum.dataResposta,
                topicoDiscussao = relatedTopicoDiscussao,
                usuario = relatedUsuario
            };
            await respostaforumRepository.CreateRespostaForum(NovoRespostaForum);

            await respostaforumRepository.Flush();

            return (respostaForum);
        }

        public Task<RespostaForumModel> UpdateRespostaForum(RespostaForumModel respostaForum)
        {
            throw new NotImplementedException();
        }

        public Task DeleteRespostaForum(int idRespostaForum)
        {
            throw new NotImplementedException();
        }
    }
}
