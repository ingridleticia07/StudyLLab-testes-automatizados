using StudyLabAPI.Mapper;
using StudyLabAPI.Models.Disciplina;
using StudyLabAPI.Models.Forum;
using StudyLabAPI.Models.Forum.DTOs;
using StudyLabAPI.Models.User;
using StudyLabAPI.Models.User.Enums;
using StudyLabAPI.Repositories;
using StudyLabAPI.Validators.CustomValidators.RequestQuery;
using ILogger = Serilog.ILogger;
using ValidationException = StudyLabAPI.Exceptions.ValidationException;

namespace StudyLabAPI.Services.Application.Forum
{
    public class ForumService : IForumService
    {
        private readonly ITopicoDiscussaoRepository _topicoDiscussaoRepository;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly ILogger _logger;
        private readonly IDisciplinaRepository _disciplinaRepository;
        private readonly IRespostaForumRepository _respostaForumRepository;
        private readonly IForumRepository _forumRepository;
        private readonly TopicoDiscussaoModelMapper _topicoModelMapper;
        private readonly RespotaForumModelMapper _respostaForumModelMapper;

        public ForumService(TopicoDiscussaoModelMapper topicoDiscussaoModelMapper, RespotaForumModelMapper
            respostaForumModelMapper, ITopicoDiscussaoRepository topicoDiscussaoRepository,
            IDisciplinaRepository disciplinaRepository, IUsuarioRepository usuarioRepository,
            IRespostaForumRepository respostaForumRepository, IForumRepository forumRepository, ILogger logger)
        {
            _topicoModelMapper = topicoDiscussaoModelMapper;
            _respostaForumModelMapper = respostaForumModelMapper;
            _topicoDiscussaoRepository = topicoDiscussaoRepository;
            _disciplinaRepository = disciplinaRepository;
            _usuarioRepository = usuarioRepository;
            _respostaForumRepository = respostaForumRepository;
            _forumRepository = forumRepository;
            _logger = logger;
        }

        public async Task<TopicoDiscussaoListResponse> GetTopicosDiscussaoLimitedByPageAndPageSize(int page, int pageSize, int idDisciplina = 0)
        {
            _logger.Information("Validando parâmetros de paginação: Page[{Page}] PageSize[{PageSize}]",
                page, pageSize);

            PageValidator validator = new(page, pageSize);

            if (!validator.isValid)
            {
                ValidationException exception = new(["Parâmetros de paginação inválidos"]);
                _logger.Error(exception, "Parâmetros de paginação inválidos");
                throw exception;
            }

            _logger.Information("Recuperando topicos da página Page[{Page}] PageSize[{PageSize}]",
                page, pageSize);

            (var result, int resultCount, int topicosCount) = await _topicoDiscussaoRepository
                .GetTopicosAndCount(page, pageSize, idDisciplina);

            var topicosReadResult = result.Select(_topicoModelMapper.TopicoDiscussaoModelToDiscussaoReadModel)
                .ToList();

            _logger.Information("Recuperado {Count} usuários da página Page[{Page}] PageSize[{PageSize}]",
                topicosReadResult.Count, page, pageSize);
            _logger.Information("Recuperando informações extras para a resposta");

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
            List<TopicoDiscussaoModel?> topicosDiscussao = await _topicoDiscussaoRepository.GetAllTopicosDiscussao();

            return topicosDiscussao;
        }

        public async Task<List<TopicoDiscussaoModel?>> GetAllTopicosDiscussaoByDisciplina(int idDisciplina)
        {
            List<TopicoDiscussaoModel?> topicosDiscussao = await _topicoDiscussaoRepository.GetAllTopicosDiscussaoByDisciplina(idDisciplina);

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
            
            bool returnCheckTopicoDiscussaoExists = await _topicoDiscussaoRepository.VerifyTopicoDiscussaoExists(topicoDiscussaoModel, topicoDiscussao.disciplina);
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
            bool returnCheckTopicoDiscussaoExists = await _topicoDiscussaoRepository.VerifyTopicoDiscussaoExistsWithId(topicoDiscussaoModel);
            return returnCheckTopicoDiscussaoExists;
        }

        public async Task<TopicoDiscussaoModel> CreateTopicoDiscussao(RegisteredTopicoDiscussaoRequestModel topicoDiscussao)
        {
            var checkIfTopicoDiscussaoExists = await VerifyTopicoDiscussaoExists(topicoDiscussao);
                        
            if(checkIfTopicoDiscussaoExists == true)
                throw new Exception("Tópico discussão existente");
                        
            int disciplinaId = topicoDiscussao.disciplina;

            DisciplinaModel? relatedDisciplina =
                await _disciplinaRepository.GetDisciplinaByIdForUpdateTopico(disciplinaId, true);

            UsuarioModel? relatedUsuario =
                await _usuarioRepository.GetUsuarioById(topicoDiscussao.idUsuario, true);

            if (relatedDisciplina is null)
            {
                throw new Exception("Disciplina não encontrada");
            }

            if (relatedUsuario is null)
            {
                throw new Exception("Usuário não encontrado");
            }

            TopicoDiscussaoModel novoTopicoDiscussao = new()
            {
                nomeTopico = topicoDiscussao.nomeTopico,
                dataTopico = topicoDiscussao.dataTopico,
                disciplina = relatedDisciplina,
                usuario = relatedUsuario
            }; 
            
            await _topicoDiscussaoRepository.CreateTopicoDiscussao(novoTopicoDiscussao);
            await _topicoDiscussaoRepository.Flush();
    
            return novoTopicoDiscussao;
        }

        public async Task<TopicoDiscussaoModel> UpdateTopicoDiscussao(RegisteredTopicoDiscussaoRequestModel topicoDiscussaoModel)
        {
            var checkIfTopicoDiscussaoExists = await VerifyTopicoDiscussaoExists(topicoDiscussaoModel);
                                    
            if(checkIfTopicoDiscussaoExists == true)
                throw new Exception("Tópico discussão existente");
            
            int disciplinaId = topicoDiscussaoModel.disciplina;

            DisciplinaModel? relatedDisciplina = await _disciplinaRepository.GetDisciplinaByIdForUpdateTopico(disciplinaId);

            TopicoDiscussaoModel? topicoDiscussaoForUpdate = await _topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoDiscussaoModel.idTopico);

            UsuarioModel? usuario = await _usuarioRepository.GetUsuarioById(topicoDiscussaoModel.idUsuario);

            if (relatedDisciplina is null)
            {
                throw new Exception("Disciplina não encontrada");
            }

            if (topicoDiscussaoForUpdate is null)
            {
                throw new Exception("Tópico não encontrado");
            }

            if (usuario is null)
            {
                throw new Exception("Usuário não encontrado");
            }

            if (!usuario.tipoUsuario.Equals(UserRole.Admin) && usuario.idUsuario != topicoDiscussaoModel.idUsuario)
            {
                throw new ArgumentException("usuário não tem permissão para excluir esse documento.");
            }

            TopicoDiscussaoModel topicoUpdated = new()
            {
                idTopico = topicoDiscussaoModel.idTopico,
                nomeTopico = topicoDiscussaoModel.nomeTopico,
                disciplina = relatedDisciplina,
                usuario = topicoDiscussaoForUpdate.usuario,
                dataTopico = topicoDiscussaoModel.dataTopico
            };
            await _topicoDiscussaoRepository.UpdateTopicoDiscussao(topicoUpdated);
            await _topicoDiscussaoRepository.Flush();

            return topicoUpdated;
        }

        public async Task DeleteTopicoDiscussao(int idTopicoDiscussao)
        {
            await _topicoDiscussaoRepository.DeleteTopicoDiscussao(idTopicoDiscussao);
            await _topicoDiscussaoRepository.Flush();
        }

        public async Task<List<RespostaForumModel?>> GetAllRespostasForum()
        {
            List<RespostaForumModel> respostaForumListado = await _respostaForumRepository.GetAllRespostasForum();

            return respostaForumListado;
        }

        public async Task<RespostaForumListResponse> GetAllRespostasForumByDisciplinaOrTopico(int page, int pageSize, int? idDisciplina, int? idTopico)
        {
            _logger.Information("Validando parâmetros de paginação: Page[{Page}] PageSize[{PageSize}]",
                page, pageSize);

            PageValidator validator = new(page, pageSize);

            if (!validator.isValid)
            {
                ValidationException exception = new(["Parâmetros de paginação inválidos"]);
                _logger.Error(exception, "Parâmetros de paginação inválidos");
                throw exception;
            }

            _logger.Information("Recuperando topicos da página Page[{Page}] PageSize[{PageSize}]",
                page, pageSize);

            (var result, int resultCount, int respostaForumCount) = await _respostaForumRepository
                .GetRespostaForumAndCount(page, pageSize, idDisciplina, idTopico);

            var respostaForumReadResult = result.Select(_respostaForumModelMapper.RespotaForumModelMapperToRespostaForumReadModel)
                .ToList();

            _logger.Information("Recuperado {Count} usuários da página Page[{Page}] PageSize[{PageSize}]",
                respostaForumReadResult.Count, page, pageSize);
            _logger.Information("Recuperando informações extras para a resposta");

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
            bool returnCheckRespostaForumExists = await _respostaForumRepository.VerifyRespostaForumExists(respostaForumModel);
            return returnCheckRespostaForumExists;
        }

        public async Task<bool> VerifyRespostaForumExistsWithId(RegisteredRespostaForumModel respostaForum)
        {
            int topicoId = respostaForum.topicoDiscussao;

            TopicoDiscussaoModel? relatedTopico = await _topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoId);

            if (relatedTopico is null)
            {
                throw new Exception("Tópico não encontrado");
            }

            RespostaForumModel respostaForumModel = new()
            {
                idResposta = respostaForum.idResposta,
                resposta = respostaForum.resposta,
                dataResposta = respostaForum.dataResposta,
                topicoDiscussao = relatedTopico
            };
            bool returnCheckRespostaForumExistsWithId = await _respostaForumRepository.VerifyRespostaForumExistsWithId(respostaForumModel);
            return returnCheckRespostaForumExistsWithId;
        }

        public async Task<RegisteredRespostaForumModel> CreateRespostaForum(RegisteredRespostaForumModel respostaForum)
        {
            int topicoDiscussaoId = respostaForum.topicoDiscussao;
            int usuarioId = respostaForum.usuario;

            TopicoDiscussaoModel? relatedTopicoDiscussao =
                await _topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoDiscussaoId, true);

            UsuarioModel? relatedUsuario =
                await _usuarioRepository.GetUsuarioById(usuarioId, true);

            if (relatedTopicoDiscussao is null)
            {
                throw new Exception("Tópico não encontrado");
            }

            if (relatedUsuario is null)
            {
                throw new Exception("Usuário não encontrado");
            }

            RespostaForumModel novoRespostaForum = new()
            {
                resposta = respostaForum.resposta,
                dataResposta = respostaForum.dataResposta,
                topicoDiscussao = relatedTopicoDiscussao,
                usuario = relatedUsuario
            };
            await _respostaForumRepository.CreateRespostaForum(novoRespostaForum);
            await _respostaForumRepository.Flush();

            return respostaForum;
        }

        public async Task<RespostaForumModel> UpdateRespostaForum(RegisteredRespostaForumModel respostaForum)
        {
            int topicoDiscussaoId = respostaForum.topicoDiscussao;
            int usuarioId = respostaForum.usuario;

            TopicoDiscussaoModel? relatedTopicoDiscussao =
                await _topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoDiscussaoId);

            UsuarioModel? relatedUsuario =
                await _usuarioRepository.GetUsuarioById(usuarioId);

            if (relatedTopicoDiscussao is null)
            {
                throw new Exception("Tópico não encontrado");
            }

            if (relatedUsuario is null)
            {
                throw new Exception("Usuário não encontrado");
            }

            if (!relatedUsuario.tipoUsuario.Equals(UserRole.Admin) && relatedTopicoDiscussao.usuario.idUsuario != respostaForum.usuario)
            {
                throw new ArgumentException("usuário não tem permissão para excluir esse documento.");
            }

            RespostaForumModel updatedRespostaForum = new()
            {
                idResposta = respostaForum.idResposta,
                resposta = respostaForum.resposta,
                dataResposta = respostaForum.dataResposta,
                topicoDiscussao = relatedTopicoDiscussao,
                usuario = relatedUsuario
            };
            await _respostaForumRepository.UpdateRespostaForum(updatedRespostaForum);
            await _respostaForumRepository.Flush();

            return updatedRespostaForum;
        }

        public async Task DeleteRespostaForum(int idRespostaForum, int idUsuario)
        {
            RespostaForumModel? respostaForum = await _respostaForumRepository.GetRespostaForumById(idRespostaForum);

            if (respostaForum is null)
            {
                throw new Exception("Resposta não encontrada");
            }

            if (!respostaForum.usuario.tipoUsuario.Equals(UserRole.Admin) && respostaForum.usuario.idUsuario != idUsuario)
                throw new ArgumentException("usuário não tem permissão para excluir esse documento.");

            await _respostaForumRepository.DeleteRespostaForum(idRespostaForum);
            await _respostaForumRepository.Flush();
        }

        public async Task<ForumModel> CreateForum(ResgisteredForumModel forum)
        {
            int respostaForumId = forum.respostaForum;
            int topicoDiscussaoId = forum.topicoDiscussao;
            int usuarioId = forum.usuario;

            RespostaForumModel? relatedRespostaForum = await _respostaForumRepository.GetRespostaForumById(respostaForumId);
            TopicoDiscussaoModel? relatedTopicoDiscussao = await _topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoDiscussaoId);
            UsuarioModel? relatedUsuario = await _usuarioRepository.GetUsuarioById(usuarioId);

            if (relatedRespostaForum is null)
            {
                throw new Exception("Resposta não encontrada");
            }

            if (relatedTopicoDiscussao is null)
            {
                throw new Exception("Tópico não encontrado");
            }

            if (relatedUsuario is null)
            {
                throw new Exception("Usuário não encontrado");
            }

            ForumModel novoForum = new()
            {
                respostaForum = relatedRespostaForum,
                usuario = relatedUsuario
            };
            await _forumRepository.CreateForum(novoForum);
            await _forumRepository.Flush();

            return novoForum;
        }

        public async Task<ForumModel> UpdateForum(ResgisteredForumModel forum)
        {
            RespostaForumModel? relatedRespostaForum = await _respostaForumRepository.GetRespostaForumById(forum.respostaForum);
            UsuarioModel? relatedUsuario = await _usuarioRepository.GetUsuarioById(forum.usuario);

            if (relatedRespostaForum is null)
            {
                throw new Exception("Resposta não encontrada");
            }

            if (relatedUsuario is null)
            {
                throw new Exception("Usuário não encontrado");
            }

            if (!relatedRespostaForum.usuario.tipoUsuario.Equals(UserRole.Admin) && relatedRespostaForum.usuario.idUsuario != forum.usuario)
                throw new ArgumentException("usuário não tem permissão para excluir esse documento.");

            ForumModel forumForUpdate = new()
            {
                idForum = forum.idForum,
                respostaForum = relatedRespostaForum,
                usuario = relatedUsuario
            };

            await _forumRepository.UpdateForum(forumForUpdate);
            await _forumRepository.Flush();

            return forumForUpdate;
        }

        public async Task<List<ForumModel>> GetAllForums()
        {
            List<ForumModel> forumModelLista = await _forumRepository.GetAllForums();

            return forumModelLista;
        }

        public async Task DeleteForum(ForumModel forum)
        {
            await _forumRepository.DeleteForum(forum.idForum);
            await _forumRepository.Flush();
        }

        public async Task<bool> VerifyForumCreated(ResgisteredForumModel forum)
        {
            int forumId = forum.respostaForum;
            int usuarioId = forum.usuario;

            RespostaForumModel? relatedRespostaForum = await _respostaForumRepository.GetRespostaForumById(forumId);
            UsuarioModel? relatedUsuario = await _usuarioRepository.GetUsuarioById(usuarioId);

            if (relatedRespostaForum is null)
            {
                throw new Exception("Resposta não encontrada");
            }

            if (relatedUsuario is null)
            {
                throw new Exception("Usuário não encontrado");
            }

            ForumModel respostaForumModel = new()
            {
                respostaForum = relatedRespostaForum,
                usuario = relatedUsuario
            };
            bool returnCheckForumExists = await _forumRepository.VerifyForumCreated(respostaForumModel);
            return returnCheckForumExists;
        }

        public async Task<bool> VerifyForumCreatedWithId(ResgisteredForumModel forum)
        {
            int forumId = forum.respostaForum;
            int usuarioId = forum.usuario;

            RespostaForumModel? relatedRespostaForum = await _respostaForumRepository.GetRespostaForumById(forumId);
            UsuarioModel? relatedUsuario = await _usuarioRepository.GetUsuarioById(usuarioId);

            if (relatedRespostaForum is null)
            {
                throw new Exception("Resposta não encontrada");
            }

            if (relatedUsuario is null)
            {
                throw new Exception("Usuário não encontrado");
            }

            ForumModel respostaForumModel = new()
            {
                idForum = forum.idForum,
                respostaForum = relatedRespostaForum,
                usuario = relatedUsuario
            };
            bool returnCheckForumExists = await _forumRepository.VerifyForumCreatedWithId(respostaForumModel);
            return returnCheckForumExists;
        }

        public async Task<List<ForumModel?>> GetForumByTopico(RegisteredTopicoDiscussaoRequestModel topico)
        {
            TopicoDiscussaoModel? relatedTopico = await _topicoDiscussaoRepository.GetTopicosDiscussaoById(topico.idTopico);

            if (relatedTopico is null)
            {
                throw new Exception("Tópico não encontrado");
            }

            List<ForumModel> forumLista = await _forumRepository.GetForumByTopico(relatedTopico);

            return forumLista;
        }
    }
}