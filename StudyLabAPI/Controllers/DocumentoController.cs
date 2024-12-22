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

        public async Task<DocumentoModel?> CreateDocumento(RegisteredDocumentoModel documento, List<IFormFile> file)
        {
            int topicoId = documento.Idtopico;

            TopicoDiscussaoModel? relatedTopico = await topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoId,true);

            int usuarioId = documento.IdUsuario;

            UsuarioModel? relatedUsuario = await usuarioRepository.GetUsuarioById(usuarioId, true);

            int fkProfessor = await topicoDiscussaoRepository.GetFkUsuarioByTopico(relatedTopico.idTopico);

            (string diretorio1, string diretorio2,tipoArquivo tipoArquivo) = await MoveDocumentFileAsync(file);

            DocumentoModel novoDocumento = new()
            {
                dataCadastro = DateOnly.FromDateTime(DateTime.Now),
                diretorioMaterial1 = diretorio1,
                diretorioMaterial2 = diretorio2,
                tipoMaterial = documento.TipoMaterial,
                topico = relatedTopico,
                status = statusDocumentoEnum.pendente,
                tipoArquivo = tipoArquivo,
                usuario = relatedUsuario,
                professor = fkProfessor
            };

            await documentoRepository.CreateDocumento(novoDocumento);

            await documentoRepository.Flush();

            return (novoDocumento);
        }

        private async Task<(string Diretorio1, string Diretorio2, tipoArquivo FileType)> MoveDocumentFileAsync(List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                throw new ArgumentException("No files uploaded.");

            if (files.Count > 1 && files.Any(f => Path.GetExtension(f.FileName)?.ToLower() == ".pdf"))
                throw new ArgumentException("Cannot upload multiple files if one is a PDF.");

            if (files.Count > 2)
                throw new ArgumentException("You can upload up to two image files or one PDF file.");

            var validExtensions = new HashSet<string> { ".jpeg", ".jpg", ".png", ".pdf" };

            foreach (var file in files)
            {
                if (file == null || file.Length == 0)
                    throw new ArgumentException("One of the uploaded files is empty.");

                string fileExtension = Path.GetExtension(file.FileName)?.ToLower();
                if (string.IsNullOrEmpty(fileExtension) || !validExtensions.Contains(fileExtension))
                    throw new ArgumentException("Unsupported file type.");

                const long maxFileSize = 2 * 1024 * 1024; // 2MB
                if (file.Length > maxFileSize)
                    throw new ArgumentException("File size exceeds the 2MB limit.");
            }

            string destinationDirectory = Path.Combine("wwwroot", "documents");

            Directory.CreateDirectory(destinationDirectory); // Ensure the folder exists

            var results = new List<(string RelativePath, tipoArquivo FileType)>();

            foreach (var file in files)
            {
                string fileExtension = Path.GetExtension(file.FileName)?.ToLower();
                string newFileName = $"document_{Guid.NewGuid()}{fileExtension}";
                string destinationFilePath = Path.Combine(destinationDirectory, newFileName);

                try
                {
                    await using var stream = new FileStream(destinationFilePath, FileMode.Create);
                    await file.CopyToAsync(stream);
                }
                catch (Exception ex)
                {
                    throw new IOException("Failed to save file.", ex);
                }

                string relativePath = Path.Combine("/documents", newFileName).Replace(Path.DirectorySeparatorChar, '/');
                
                tipoArquivo type = fileExtension switch
                {
                    ".jpeg" or ".jpg" or ".png" => tipoArquivo.imagem,
                    ".pdf" => tipoArquivo.pdf,
                    _ => throw new ArgumentException("Unsupported file type.")
                };

                results.Add((relativePath, type));
            }

            string diretorio1 = results.Count > 0 ? results[0].RelativePath : null;
            string diretorio2 = results.Count > 1 ? results[1].RelativePath : null;
            tipoArquivo fileType = results.Count > 0 ? results[0].FileType : tipoArquivo.imagem;

            return (diretorio1, diretorio2, fileType);
        }


        public async Task DeleteDocumento(int idDocumento, int idUsuario)
        {
            DocumentoModel documento = await documentoRepository.GetDocumentoById(idDocumento);

            if(documento.usuario.tipoUsuario.Equals(UserRole.User)
                && documento.usuario.idUsuario !=idUsuario)
                throw new ArgumentException("usuário não tem permissão para excluir esse documento.");

            if (documento.usuario.tipoUsuario.Equals(UserRole.Prof)
                && documento.professor != idUsuario)
                throw new ArgumentException("usuário não tem permissão para excluir esse documento.");

            string rootDirectory = "wwwroot";

            string file1 = string.Concat(rootDirectory, documento.diretorioMaterial1);
            string file2 = string.Concat(rootDirectory, documento.diretorioMaterial2);

            if (File.Exists(file1))
                File.Delete(file1);

            if (File.Exists(file2))
                File.Delete(file2);

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
                diretorioMaterial1 = documentoUpdate.diretorioMaterial1,
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
