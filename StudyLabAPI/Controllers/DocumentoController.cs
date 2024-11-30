using StudyLabAPI.Exceptions;
using StudyLabAPI.Mapper;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Enums;
using StudyLabAPI.Repositories;
using StudyLabAPI.Validators.CustomValidators.RequestQuery;
using ILogger = Serilog.ILogger;

namespace StudyLabAPI.Controllers
{
    public class DocumentoController : IDocumentoController
    {

        private ITopicoDiscussaoRepository topicoDiscussaoRepository { get; }

        private IUsuarioRepository usuarioRepository { get; }
        private ILogger logger { get; }

        private IDisciplinaRepository DisciplinaRepository { get; }

        private IRespostaForumRepository respostaforumRepository { get; }

        private IForumRepository forumRepository { get; }

        private IDocumentoRepository documentoRepository { get; }

        private readonly DocumentoModelMapper _documentoModelMapper;

        private readonly DenunciaModelMapper _denunciaModelMapper;

        public DocumentoController(DocumentoModelMapper
            documentoModelMapper, DenunciaModelMapper
            denunciaModelMapper, ITopicoDiscussaoRepository topicoDiscussaoRepository,
            IDisciplinaRepository DisciplinaRepository, IUsuarioRepository usuarioRepository,
            IRespostaForumRepository respostaForumRepository, IForumRepository forumRepository,
            IDocumentoRepository documentoRepository, ILogger logger)
        {
            this._documentoModelMapper = documentoModelMapper;
            this._denunciaModelMapper = denunciaModelMapper;
            this.topicoDiscussaoRepository = topicoDiscussaoRepository;
            this.DisciplinaRepository = DisciplinaRepository;
            this.usuarioRepository = usuarioRepository;
            this.respostaforumRepository = respostaForumRepository;
            this.forumRepository = forumRepository;
            this.documentoRepository = documentoRepository;
            this.logger = logger;
        }

        public async Task<DocumentoModel?> CreateDocumento(RegisteredDocumentoModel documento, IFormFile file)
        {
            int topicoId = documento.Idtopico;

            TopicoDiscussaoModel? relatedTopico = await topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoId);

            int usuarioId = documento.IdUsuario;

            UsuarioModel? relatedUsuario = await usuarioRepository.GetUsuarioById(usuarioId);


            (string diretorio, tipoArquivo tipoArquivo) = await MoveDocumentFileAsync(file);

            DocumentoModel novoDocumento = new()
            {
                dataCadastro = DateOnly.FromDateTime(DateTime.Now),
                diretorioMaterial = diretorio,
                tipoMaterial = documento.TipoMaterial,
                topico = relatedTopico,
                status = statusDocumentoEnum.pendente,
                tipoArquivo = tipoArquivo,
                usuario = relatedUsuario
            };

            novoDocumento.diretorioMaterial = diretorio;

            await documentoRepository.CreateDocumento(novoDocumento);

            await documentoRepository.Flush();

            return (novoDocumento);
        }

        private async Task<(string, tipoArquivo)> MoveDocumentFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("No file uploaded.");
            }

            string fileExtension = Path.GetExtension(file.FileName).ToLower();

            // Validar tipos suportados
            var validExtensions = new[] { ".jpeg", ".jpg", ".png", ".pdf" };
            if (!validExtensions.Contains(fileExtension))
            {
                throw new ArgumentException("Unsupported file type.");
            }

            // Gerar novo nome único
            string newFileName = $"document_{Guid.NewGuid()}{fileExtension}";

            // Configurar diretórios
            string basePath = Directory.GetCurrentDirectory();

            string wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            string destinationDirectory = Path.Combine(wwwRootPath, "documents");
            logger.Information("[{basePath}]",
            basePath);
            logger.Information("[{wwwRootPath}]",
            wwwRootPath);
            Directory.CreateDirectory(destinationDirectory); // Garantir que a pasta existe

            // Caminho do arquivo
            string destinationFilePath = Path.Combine(destinationDirectory, newFileName);

            try
            {
                // Salvar o arquivo
                using (var stream = new FileStream(destinationFilePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to save file: {ex.Message}");
            }

            // Caminho relativo para acesso
            string finalPath = $"/documents/{newFileName}";

            // Determinar tipo de arquivo
            tipoArquivo fileType = fileExtension switch
            {
                ".jpeg" or ".jpg" or ".png" => tipoArquivo.imagem,
                ".pdf" => tipoArquivo.pdf,
                _ => throw new ArgumentException("Unsupported file type.")
            };

            return (finalPath, fileType);
        }


        public async Task DeleteDocumento(int idDocumento)
        {
            DocumentoModel documento = await documentoRepository.GetDocumentoById(idDocumento);

            string rootDirectory = "wwwroot";

            string fullPath = string.Concat(rootDirectory, documento.diretorioMaterial);

            if (File.Exists(fullPath))
                File.Delete(fullPath);

            await documentoRepository.DeleteDocumento(idDocumento);

            await documentoRepository.Flush();
        }

        public async Task<List<DocumentoModel?>> GetAllDocumentos()
        {
            List<DocumentoModel> documentosLista = await documentoRepository.GetAllDocumentos();
            // You should map DisciplinaModel to DisciplinaReadModel and return the list

            return documentosLista;
        }

        public async Task<List<DocumentoModel?>> GetDocumentoByTopico(RegisteredDocumentoModel documento)
        {
            int topicoId = documento.Idtopico;

            TopicoDiscussaoModel? relatedTopico = await topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoId);

            List<DocumentoModel?> documentos = await documentoRepository.GetDocumentoByTopico(relatedTopico);

            return documentos;
        }

        public async Task<DenunciaReadModel> UpdateDenunciaStatus(DenunciaReadModel denunciaUpdate)
        {
            await documentoRepository.UpdateDenunciaStatus(denunciaUpdate);

            await documentoRepository.Flush();

            return (denunciaUpdate);
        }

        public async Task<DocumentoModel?> UpdateDocumento(RegisteredDocumentoModel documentoUpdate)
        {
            int topicoId = documentoUpdate.Idtopico;

            TopicoDiscussaoModel? relatedTopico = await topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoId);

            DocumentoModel documentoUpdateObj = new()
            {
                idDocumento = documentoUpdate.idDocumento,
                dataCadastro = DateOnly.FromDateTime(DateTime.Now),
                diretorioMaterial = documentoUpdate.diretorioMaterial,
                tipoMaterial = documentoUpdate.TipoMaterial,
                topico = relatedTopico,
            };
            await documentoRepository.UpdateDocumento(documentoUpdateObj);

            await documentoRepository.Flush();

            return (documentoUpdateObj);
        }

        public async Task<DocumentoListResponse> GetAllDocumentosByDisciplinaOrTopico(int page, int pageSize, int? idDisciplina, int? idTopico, bool isAnyStatus)
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

            (var result, int resultCount, int documentoCount) = await documentoRepository
            .GetDocumentosAndCount(page, pageSize, idDisciplina, idTopico, isAnyStatus);

            var documentoReadResult = result.Select(_documentoModelMapper.DocumentoModelMapperToDocumentoReadModel)
                .ToList();

            logger.Information("Recuperado {Count} usuários da página Page[{Page}] PageSize[{PageSize}]",
                documentoReadResult.Count, page, pageSize);
            logger.Information("Recuperando informações extras para a resposta");

            int maxPage = documentoCount / pageSize;
            if (documentoCount % pageSize != 0)
                maxPage++;

            return new()
            {
                maxPage = maxPage,
                documentoForumCount = documentoCount,
                pageCount = resultCount,
                documentos = documentoReadResult
            };
        }

        public async Task<DenunciaListResponse> GetAllDenuncias(int page, int pageSize)
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

            (var result, int resultCount, int denunciaCount) = await documentoRepository
            .GetDenunciasAndCount(page, pageSize);

            var denunciaReadResult = result.Select(_denunciaModelMapper.UsuarioModelMapperToDenunciaReadModel)
                .ToList();

            logger.Information("Recuperado {Count} usuários da página Page[{Page}] PageSize[{PageSize}]",
                denunciaReadResult.Count, page, pageSize);
            logger.Information("Recuperando informações extras para a resposta");

            int maxPage = denunciaCount / pageSize;
            if (denunciaCount % pageSize != 0)
                maxPage++;

            return new()
            {
                maxPage = maxPage,
                denunciaCount = denunciaCount,
                pageCount = resultCount,
                denuncias = denunciaReadResult
            };
        }

        public async Task CreateDenuncia(int idDocumento, int idUsuario)
        {
            DocumentoModel? relatedDocumento = await documentoRepository.GetDocumentoById(idDocumento);

            UsuarioModel? relatedUsuario = await usuarioRepository.GetUsuarioById(idUsuario);

            bool checkDenunciaAlreadyExists = await documentoRepository.CheckDenunciaAlreadyExists(idDocumento, idUsuario);

            if (!checkDenunciaAlreadyExists)
            {
                DenunciaModel novaDenuncia = new()
                {
                    usuario = relatedUsuario,
                    documento = relatedDocumento,
                    dataDenuncia = DateOnly.FromDateTime(DateTime.Now),
                    statusDenuncia = statusDenunciaEnum.Analise
                };

                await documentoRepository.CreateDenuncia(novaDenuncia);

                await documentoRepository.Flush();
            }

        }
    }
}
