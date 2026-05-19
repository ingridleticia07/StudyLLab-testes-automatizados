using StudyLabAPI.Exceptions;
using StudyLabAPI.Mapper;
using StudyLabAPI.Models.Forum;
using StudyLabAPI.Models.Material;
using StudyLabAPI.Models.Material.DTOs;
using StudyLabAPI.Models.Material.Enums;
using StudyLabAPI.Models.User;
using StudyLabAPI.Models.User.Enums;
using StudyLabAPI.Repositories.Auth;
using StudyLabAPI.Repositories.Curso;
using StudyLabAPI.Repositories.Disciplina;
using StudyLabAPI.Repositories.Forum;
using StudyLabAPI.Repositories.Material;
using StudyLabAPI.Repositories.User;
using StudyLabAPI.Validators.CustomValidators.RequestQuery;
using Supabase;
using ILogger = Serilog.ILogger;

namespace StudyLabAPI.Services.Application.Documento
{
    public class DocumentoService : IDocumentoService
    {
        private readonly ITopicoDiscussaoRepository _topicoDiscussaoRepository;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly ILogger _logger;
        private readonly IDisciplinaRepository _disciplinaRepository;
        private readonly IRespostaForumRepository _respostaForumRepository;
        private readonly IForumRepository _forumRepository;
        private readonly IDocumentoRepository _documentoRepository;
        private readonly DocumentoModelMapper _documentoModelMapper;
        private readonly DenunciaModelMapper _denunciaModelMapper;
        private readonly IServiceProvider _serviceProvider;
        private readonly Client _supabaseClient;

        public DocumentoService(
            DocumentoModelMapper documentoModelMapper,
            DenunciaModelMapper denunciaModelMapper,
            ITopicoDiscussaoRepository topicoDiscussaoRepository,
            IDisciplinaRepository disciplinaRepository,
            IUsuarioRepository usuarioRepository,
            IRespostaForumRepository respostaForumRepository,
            IForumRepository forumRepository,
            IDocumentoRepository documentoRepository,
            ILogger logger,
            IServiceProvider serviceProvider,
            Client supabaseClient)
        {
            _documentoModelMapper = documentoModelMapper;
            _denunciaModelMapper = denunciaModelMapper;
            _topicoDiscussaoRepository = topicoDiscussaoRepository;
            _disciplinaRepository = disciplinaRepository;
            _usuarioRepository = usuarioRepository;
            _respostaForumRepository = respostaForumRepository;
            _forumRepository = forumRepository;
            _documentoRepository = documentoRepository;
            _logger = logger;
            _serviceProvider = serviceProvider;
            _supabaseClient = supabaseClient;
        }

        public async Task<DocumentoModel?> CreateDocumento(RegisteredDocumentoModel documento, List<IFormFile> file)
        {
            int topicoId = documento.Idtopico;

            TopicoDiscussaoModel? relatedTopico = await _topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoId, true);

            int usuarioId = documento.IdUsuario;

            UsuarioModel? relatedUsuario = await _usuarioRepository.GetUsuarioById(usuarioId, true);

            (string diretorio1, string diretorio2, TipoArquivo tipoArquivo) = await MoveDocumentFileAsync(file);

            DocumentoModel novoDocumento = new()
            {
                dataCadastro = DateOnly.FromDateTime(DateTime.Now),
                diretorioMaterial1 = diretorio1,
                diretorioMaterial2 = diretorio2,
                tipoMaterial = documento.TipoMaterial,
                topico = relatedTopico,
                status = StatusDocumento.Pendente,
                tipoArquivo = tipoArquivo,
                usuario = relatedUsuario
            };

            await _documentoRepository.CreateDocumento(novoDocumento);
            await _documentoRepository.Flush();

            return novoDocumento;
        }

        private async Task<(string Diretorio1, string Diretorio2, TipoArquivo FileType)> MoveDocumentFileAsync(List<IFormFile> files)
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

                const long maxFileSize = 2 * 1024 * 1024;
                if (file.Length > maxFileSize)
                    throw new ArgumentException("File size exceeds the 2MB limit.");
            }

            string destinationDirectory = Path.Combine("wwwroot", "documents");
            Directory.CreateDirectory(destinationDirectory);

            var results = new List<(string RelativePath, TipoArquivo FileType)>();

            foreach (var file in files)
            {
                string fileExtension = Path.GetExtension(file.FileName)?.ToLower();
                string newFileName = $"document_{Guid.NewGuid()}{fileExtension}";

                try
                {
                    await UploadToSupabaseAsync(file, newFileName);

                    string relativePath = Path.Combine("/documents", newFileName).Replace(Path.DirectorySeparatorChar, '/');

                    TipoArquivo type = fileExtension switch
                    {
                        ".jpeg" or ".jpg" or ".png" => TipoArquivo.Imagem,
                        ".pdf" => TipoArquivo.Pdf,
                        _ => throw new ArgumentException("Unsupported file type.")
                    };

                    results.Add((relativePath, type));
                }
                catch (Exception ex)
                {
                    throw new IOException("Failed to save file.", ex);
                }
            }

            string diretorio1 = results.Count > 0 ? results[0].RelativePath : null;
            string diretorio2 = results.Count > 1 ? results[1].RelativePath : null;
            TipoArquivo fileType = results.Count > 0 ? results[0].FileType : TipoArquivo.Imagem;

            return (diretorio1, diretorio2, fileType);
        }

        private async Task UploadToSupabaseAsync(IFormFile file, string fileName)
        {
            try
            {
                await using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                byte[] fileBytes = memoryStream.ToArray();

                var result = await _supabaseClient.Storage
                    .From("study-documents")
                    .Upload(fileBytes, $"documents/{fileName}");

                _logger.Information("Upload para Supabase realizado: {Result}", result);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Erro no upload para Supabase para o arquivo: {FileName}", fileName);
            }
        }

        public async Task DeleteDocumento(int idDocumento, int idUsuario)
        {
            DocumentoModel documento = await _documentoRepository.GetDocumentoById(idDocumento);

            if (documento.usuario.tipoUsuario.Equals(UserRole.User)
                && documento.usuario.idUsuario != idUsuario)
                throw new ArgumentException("usuário não tem permissão para excluir esse documento.");

            await DeleteFromSupabaseAsync(documento.diretorioMaterial1, documento.diretorioMaterial2);

            await _documentoRepository.DeleteDocumento(idDocumento);
            await _documentoRepository.Flush();
        }

        private async Task DeleteFromSupabaseAsync(string filePath1, string filePath2)
        {
            try
            {
                var filesToDelete = new List<string>();

                if (!string.IsNullOrEmpty(filePath1))
                {
                    string supabasePath1 = filePath1.TrimStart('/');
                    filesToDelete.Add(supabasePath1);
                }

                if (!string.IsNullOrEmpty(filePath2))
                {
                    string supabasePath2 = filePath2.TrimStart('/');
                    filesToDelete.Add(supabasePath2);
                }

                if (filesToDelete.Any())
                {
                    await _supabaseClient.Storage
                        .From("study-documents")
                        .Remove(filesToDelete);

                    _logger.Information("Arquivos removidos do Supabase: {FileCount} arquivos", filesToDelete.Count);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Erro ao remover arquivos do Supabase: {FilePath1}, {FilePath2}", filePath1, filePath2);
            }
        }

        public async Task<List<DocumentoModel?>> GetAllDocumentos()
        {
            List<DocumentoModel> documentosLista = await _documentoRepository.GetAllDocumentos();

            return documentosLista;
        }

        public async Task<List<DocumentoModel?>> GetDocumentoByTopico(RegisteredDocumentoModel documento)
        {
            int topicoId = documento.Idtopico;

            TopicoDiscussaoModel? relatedTopico = await _topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoId);

            List<DocumentoModel?> documentos = await _documentoRepository.GetDocumentoByTopico(relatedTopico);

            return documentos;
        }

        public async Task<DenunciaReadModel> UpdateDenunciaStatus(DenunciaReadModel denunciaUpdate)
        {
            await _documentoRepository.UpdateDenunciaStatus(denunciaUpdate);
            await _documentoRepository.Flush();

            return denunciaUpdate;
        }

        public async Task<DocumentoModel?> UpdateDocumento(RegisteredDocumentoModel documentoUpdate)
        {
            int topicoId = documentoUpdate.Idtopico;

            TopicoDiscussaoModel? relatedTopico = await _topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoId);

            DocumentoModel documentoUpdateObj = new()
            {
                idDocumento = documentoUpdate.idDocumento,
                dataCadastro = DateOnly.FromDateTime(DateTime.Now),
                diretorioMaterial1 = documentoUpdate.diretorioMaterial1,
                tipoMaterial = documentoUpdate.TipoMaterial,
                topico = relatedTopico,
            };

            await _documentoRepository.UpdateDocumento(documentoUpdateObj);
            await _documentoRepository.Flush();

            return documentoUpdateObj;
        }

        public async Task<DocumentoListResponse> GetAllDocumentosByDisciplinaOrTopico(int page, int pageSize, int? idDisciplina, int? idTopico, bool isAnyStatus)
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

            (var result, int resultCount, int documentoCount) = await _documentoRepository
                .GetDocumentosAndCount(page, pageSize, idDisciplina, idTopico, isAnyStatus);

            var documentoReadResult = result.Select(_documentoModelMapper.DocumentoModelMapperToDocumentoReadModel)
                .ToList();

            _logger.Information("Recuperado {Count} usuários da página Page[{Page}] PageSize[{PageSize}]",
                documentoReadResult.Count, page, pageSize);
            _logger.Information("Recuperando informações extras para a resposta");

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

            (var result, int resultCount, int denunciaCount) = await _documentoRepository
                .GetDenunciasAndCount(page, pageSize);

            var denunciaReadResult = result.Select(_denunciaModelMapper.DenunciaModelMapperToDenunciaReadModel)
                .ToList();

            _logger.Information("Recuperado {Count} usuários da página Page[{Page}] PageSize[{PageSize}]",
                denunciaReadResult.Count, page, pageSize);
            _logger.Information("Recuperando informações extras para a resposta");

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

        public async Task CreateDenuncia(int idDocumento, int idUsuario, string descricao)
        {
            DocumentoModel? relatedDocumento = await _documentoRepository.GetDocumentoById(idDocumento);

            UsuarioModel? relatedUsuario = await _usuarioRepository.GetUsuarioById(idUsuario, true);

            bool checkDenunciaAlreadyExists = await _documentoRepository.CheckDenunciaAlreadyExists(idDocumento, idUsuario);

            if (!checkDenunciaAlreadyExists)
            {
                DenunciaModel novaDenuncia = new()
                {
                    usuario = relatedUsuario,
                    documento = relatedDocumento,
                    dataDenuncia = DateOnly.FromDateTime(DateTime.Now),
                    statusDenuncia = StatusDenuncia.Analise,
                    descricao = descricao
                };

                await _documentoRepository.CreateDenuncia(novaDenuncia);
                await _documentoRepository.Flush();
            }
        }
    }
}
