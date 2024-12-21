using StudyLabAPI.Mapper;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Enums;
using StudyLabAPI.Repositories;
using StudyLabAPI.Validators.CustomValidators.RequestQuery;
using ILogger = Serilog.ILogger;
using ValidationException = StudyLabAPI.Exceptions.ValidationException;

namespace StudyLabAPI.Controllers
{
    public class ForumController : IForumController
    {
        private ITopicoDiscussaoRepository topicoDiscussaoRepository { get; }

        private IUsuarioRepository usuarioRepository { get; }
        private ILogger logger { get; }

        private IDisciplinaRepository DisciplinaRepository { get; }

        private IRespostaForumRepository respostaforumRepository { get; }

        private IForumRepository forumRepository { get; }

        private readonly TopicoDiscussaoModelMapper _topicoModelMapper;

        private readonly RespotaForumModelMapper _respostaForumModelMapper;

        public ForumController(TopicoDiscussaoModelMapper topicoDiscussaoModelMapper, RespotaForumModelMapper
            respostaForumModelMapper, ITopicoDiscussaoRepository topicoDiscussaoRepository,
            IDisciplinaRepository DisciplinaRepository, IUsuarioRepository usuarioRepository,
            IRespostaForumRepository respostaForumRepository, IForumRepository forumRepository, ILogger logger)
        {
            this._topicoModelMapper = topicoDiscussaoModelMapper;
            this._respostaForumModelMapper = respostaForumModelMapper;
            this.topicoDiscussaoRepository = topicoDiscussaoRepository;
            this.DisciplinaRepository = DisciplinaRepository;
            this.usuarioRepository = usuarioRepository;
            this.respostaforumRepository = respostaForumRepository;
            this.forumRepository = forumRepository;
            this.logger = logger;
        }
        public async Task<TopicoDiscussaoListResponse> GetTopicosDiscussaoLimitedByPageAndPageSize(int page, int pageSize)
        {
            logger.Information("Validando parâmetros de paginação: Page[{Page}] PageSize[{PageSize}]",
            page, pageSize);

            PageValidator validator = new(page, pageSize);

            if (!validator.isValid)
            {
                ValidationException exception = new(["Parâmetros de paginação inválidos"]);
                logger.Error(exception, "Parâmetros de paginação inválidos");
                throw exception;
            }

            logger.Information("Recuperando topicos da página Page[{Page}] PageSize[{PageSize}]",
                page, pageSize);

            (var result, int resultCount, int topicosCount) = await topicoDiscussaoRepository
            .GetTopicosAndCount(page, pageSize);

            var topicosReadResult = result.Select(_topicoModelMapper.TopicoDiscussaoModelToDiscussaoReadModel)
                .ToList();

            logger.Information("Recuperado {Count} usuários da página Page[{Page}] PageSize[{PageSize}]",
                topicosReadResult.Count, page, pageSize);
            logger.Information("Recuperando informações extras para a resposta");

            int maxPage = topicosCount / pageSize;
            if (topicosCount % pageSize != 0)
                maxPage++;

            return new()
            {
                maxPage = maxPage,
                topicoCount = topicosCount,
                pageCount = resultCount,
                topicos = topicosReadResult
            };
        }

        public async Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussao()
        {
            List<TopicoDiscussaoModel?> topicosDiscussao = await topicoDiscussaoRepository.GetAllTopicosDiscussao();

            return topicosDiscussao;
        }

        public async Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussaoByDisciplina(int idDisciplina)
        {
            List<TopicoDiscussaoModel?> topicosDiscussao = await topicoDiscussaoRepository.GetAllTopicosDiscussaoByDisciplina(idDisciplina);

            return topicosDiscussao;
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
            UsuarioModel? relatedUsuario = await usuarioRepository.GetUsuarioById(topicoDiscussao.idUsuario);

            TopicoDiscussaoModel NovotopicoDiscussao = new()
            {
                nomeTopico = topicoDiscussao.nomeTopico,
                dataTopico = topicoDiscussao.dataTopico,
                disciplina = relatedDisciplina,
                usuario = relatedUsuario
            };
            await topicoDiscussaoRepository.CreateTopicoDiscussao(NovotopicoDiscussao);

            await topicoDiscussaoRepository.Flush();

            return (NovotopicoDiscussao);
        }

        public async Task<TopicoDiscussaoModel> UpdateTopicoDiscussao(RegisteredTopicoDiscussaoRequestModel topicoDiscussaoModel)
        {
            int disciplinaId = topicoDiscussaoModel.disciplina;

            DisciplinaModel? relatedDisciplina = await DisciplinaRepository.GetDisciplinaById(disciplinaId);

            TopicoDiscussaoModel? topicoDiscussaoForUpdate = await topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoDiscussaoModel.idTopico);

            if (!topicoDiscussaoForUpdate.usuario.tipoUsuario.Equals(UserRole.Admin) && topicoDiscussaoForUpdate.usuario.idUsuario != topicoDiscussaoModel.idUsuario)
                throw new ArgumentException("usuário não tem permissão para excluir esse documento.");

            TopicoDiscussaoModel topicoUpdated = new()
            {
                idTopico = topicoDiscussaoModel.idTopico,
                nomeTopico = topicoDiscussaoModel.nomeTopico,
                disciplina = relatedDisciplina,
                dataTopico = topicoDiscussaoModel.dataTopico
            };
            await topicoDiscussaoRepository.UpdateTopicoDiscussao(topicoUpdated);
            await topicoDiscussaoRepository.Flush();

            return (topicoUpdated);
        }

        public async Task DeleteTopicoDiscussao(int idTopicoDiscussao)
        {
            //verificar se disciplina existe, por meio do buscar disciplina
            //para em caso de exstir, excluir a mesma
            await topicoDiscussaoRepository.DeleteTopicoDiscussao(idTopicoDiscussao);
            await topicoDiscussaoRepository.Flush();
        }

        public async Task<List<RespostaForumModel?>> GetAllRespostasForum()
        {
            List<RespostaForumModel> RespostaForumListado = await respostaforumRepository.GetAllRespostasForum();

            return RespostaForumListado;
        }

        public async Task<RespostaForumListResponse> GetAllRespostasForumByDisciplinaOrTopico(int page, int pageSize, int? idDisciplina, int? idTopico)
        {
            logger.Information("Validando parâmetros de paginação: Page[{Page}] PageSize[{PageSize}]",
            page, pageSize);

            PageValidator validator = new(page, pageSize);

            if (!validator.isValid)
            {
                ValidationException exception = new(["Parâmetros de paginação inválidos"]);
                logger.Error(exception, "Parâmetros de paginação inválidos");
                throw exception;
            }

            logger.Information("Recuperando topicos da página Page[{Page}] PageSize[{PageSize}]",
                page, pageSize);

            (var result, int resultCount, int respostaForumCount) = await respostaforumRepository
            .GetRespostaForumAndCount(page, pageSize, idDisciplina, idTopico);

            var respostaForumReadResult = result.Select(_respostaForumModelMapper.RespotaForumModelMapperToRespostaForumReadModel)
                .ToList();

            logger.Information("Recuperado {Count} usuários da página Page[{Page}] PageSize[{PageSize}]",
                respostaForumReadResult.Count, page, pageSize);
            logger.Information("Recuperando informações extras para a resposta");

            int maxPage = respostaForumCount / pageSize;
            if (respostaForumCount % pageSize != 0)
                maxPage++;

            return new()
            {
                maxPage = maxPage,
                respostaForumCount = respostaForumCount,
                pageCount = resultCount,
                respostasForum = respostaForumReadResult
            };
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
            int topicoId = respostaForum.topicoDiscussao;

            TopicoDiscussaoModel? relatedTopico = await topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoId);

            RespostaForumModel respostaForumModel = new()
            {
                idResposta = respostaForum.idResposta,
                resposta = respostaForum.resposta,
                dataResposta = respostaForum.dataResposta,
                topicoDiscussao = relatedTopico
            };
            bool returnCheckrespostaForumExistsWithId = await respostaforumRepository.VerifyRespostaForumExistsWithId(respostaForumModel);
            return returnCheckrespostaForumExistsWithId;
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

        public async Task<RespostaForumModel> UpdateRespostaForum(RegisteredRespostaForumModel respostaForum)
        {
            int topicoDiscussaoId = respostaForum.topicoDiscussao;

            int UsuarioId = respostaForum.usuario;

            TopicoDiscussaoModel? relatedTopicoDiscussao =
                await topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoDiscussaoId);

            UsuarioModel? relatedUsuario =
                await usuarioRepository.GetUsuarioById(UsuarioId);

            if (!relatedUsuario.tipoUsuario.Equals(UserRole.Admin) && relatedTopicoDiscussao.usuario.idUsuario != respostaForum.usuario)
                throw new ArgumentException("usuário não tem permissão para excluir esse documento.");

            RespostaForumModel updatedRespostaForum = new()
            {
                idResposta = respostaForum.idResposta,
                resposta = respostaForum.resposta,
                dataResposta = respostaForum.dataResposta,
                topicoDiscussao = relatedTopicoDiscussao,
                usuario = relatedUsuario
            };
            await respostaforumRepository.UpdateRespostaForum(updatedRespostaForum);
            await respostaforumRepository.Flush();

            return (updatedRespostaForum);
        }

        public async Task DeleteRespostaForum(int idRespostaForum, int idUsuario)
        {
            RespostaForumModel repostaForum = await respostaforumRepository.GetRespostaForumById(idRespostaForum);

            if (!repostaForum.usuario.tipoUsuario.Equals(UserRole.Admin) && repostaForum.usuario.idUsuario != idUsuario)
                throw new ArgumentException("usuário não tem permissão para excluir esse documento.");

            await respostaforumRepository.DeleteRespostaForum(idRespostaForum);
            await respostaforumRepository.Flush();
        }

        public async Task<ForumModel> CreateForum(ResgisteredForumModel forum)
        {
            //passar id 
            int respostaForumId = forum.respostaForum;

            int topicoDiscussaoId = forum.topicoDiscussao;

            int usuarioId = forum.usuario;

            RespostaForumModel? relatedRespostaForum = await respostaforumRepository.GetRespostaForumById(respostaForumId);

            TopicoDiscussaoModel? relatedTopicoDiscussao = await topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoDiscussaoId);

            UsuarioModel? relatedUsuario = await usuarioRepository.GetUsuarioById(usuarioId);

            ForumModel NovoForum = new()
            {
                respostaForum = relatedRespostaForum,
                usuario = relatedUsuario
            };
            await forumRepository.CreateForum(NovoForum);

            await forumRepository.Flush();

            return (NovoForum);
        }

        public async Task<ForumModel> UpdateForum(ResgisteredForumModel forum)
        {
            RespostaForumModel? relatedRespostaForum = await respostaforumRepository.GetRespostaForumById(forum.respostaForum);

            UsuarioModel? relatedUsuario = await usuarioRepository.GetUsuarioById(forum.usuario);

            if (!relatedRespostaForum.usuario.tipoUsuario.Equals(UserRole.Admin) && relatedRespostaForum.usuario.idUsuario != forum.usuario)
                throw new ArgumentException("usuário não tem permissão para excluir esse documento.");

            ForumModel forumForUpdate = new()
            {
                idForum = forum.idForum,
                respostaForum = relatedRespostaForum,
                usuario = relatedUsuario
            };


            await forumRepository.UpdateForum(forumForUpdate);

            await forumRepository.Flush();

            return (forumForUpdate);
        }

        public async Task<List<ForumModel>> GetAllForums()
        {
            List<ForumModel> forumModelLista = await forumRepository.GetAllForums();
            // You should map DisciplinaModel to DisciplinaReadModel and return the list

            return forumModelLista;
        }

        public async Task DeleteForum(ForumModel forum)
        {
            //verificar se disciplina existe, por meio do buscar disciplina
            //para em caso de exstir, excluir a mesma
            await forumRepository.DeleteForum(forum.idForum);
            await forumRepository.Flush();

        }

        public async Task<bool> VerifyForumCreated(ResgisteredForumModel forum)
        {
            int forumId = forum.respostaForum;

            int topicoId = forum.topicoDiscussao;

            int usuarioId = forum.respostaForum;

            RespostaForumModel? relatedRespostaForum = await respostaforumRepository.GetRespostaForumById(forumId);

            UsuarioModel? relatedUsuario = await usuarioRepository.GetUsuarioById(usuarioId);

            ForumModel respostaForumModel = new()
            {
                respostaForum = relatedRespostaForum,
                usuario = relatedUsuario
            };
            bool returnCheckForumExists = await forumRepository.VerifyForumCreated(respostaForumModel);
            return returnCheckForumExists;
        }

        public async Task<bool> VerifyForumCreatedWithId(ResgisteredForumModel forum)
        {
            int forumId = forum.respostaForum;

            int topicoId = forum.topicoDiscussao;

            int usuarioId = forum.respostaForum;

            RespostaForumModel? relatedRespostaForum = await respostaforumRepository.GetRespostaForumById(forumId);

            UsuarioModel? relatedUsuario = await usuarioRepository.GetUsuarioById(usuarioId);

            ForumModel respostaForumModel = new()
            {
                idForum = forum.idForum,
                respostaForum = relatedRespostaForum,
                usuario = relatedUsuario
            };
            bool returnCheckForumExists = await forumRepository.VerifyForumCreatedWithId(respostaForumModel);
            return returnCheckForumExists;
        }

        public async Task<List<ForumModel?>> GetForumByTopico(RegisteredTopicoDiscussaoRequestModel topico)
        {
            TopicoDiscussaoModel? relatedTopico = await topicoDiscussaoRepository.GetTopicosDiscussaoById(topico.idTopico);

            List<ForumModel> forumLista = await forumRepository.GetForumByTopico(relatedTopico);

            return forumLista;
        }

    }
}
