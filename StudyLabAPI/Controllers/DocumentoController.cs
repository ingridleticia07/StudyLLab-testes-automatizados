using StudyLabAPI.Exceptions;
using StudyLabAPI.Mapper;
using StudyLabAPI.Models;
using StudyLabAPI.Repositories;
using StudyLabAPI.Validators.CustomValidators.RequestQuery;
using ILogger = Serilog.ILogger;
using Supabase; // Adicione esta using
using Microsoft.Extensions.DependencyInjection;
using StudyLabAPI.Models.Forum;
using StudyLabAPI.Models.Material;
using StudyLabAPI.Models.Material.DTOs;
using StudyLabAPI.Models.Material.Enums;
using StudyLabAPI.Models.User;
using StudyLabAPI.Models.User.Enums;

// Adicione esta using

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
        
        private readonly IServiceProvider _serviceProvider;
        
        private readonly Client _supabaseClient;
        public DocumentoController(DocumentoModelMapper
            documentoModelMapper, DenunciaModelMapper
            denunciaModelMapper, ITopicoDiscussaoRepository topicoDiscussaoRepository,
            IDisciplinaRepository DisciplinaRepository, IUsuarioRepository usuarioRepository,
            IRespostaForumRepository respostaForumRepository, IForumRepository forumRepository,
            IDocumentoRepository documentoRepository, ILogger logger,
            IServiceProvider serviceProvider,
            Client supabaseClient)
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
            this._serviceProvider = serviceProvider;
            this._supabaseClient = supabaseClient;
        }

        public async Task<DocumentoModel?> CreateDocumento(RegisteredDocumentoModel documento, List<IFormFile> file)
        {
            int topicoId = documento.Idtopico;

            TopicoDiscussaoModel? relatedTopico = await topicoDiscussaoRepository.GetTopicosDiscussaoById(topicoId,true);

            int usuarioId = documento.IdUsuario;

            UsuarioModel? relatedUsuario = await usuarioRepository.GetUsuarioById(usuarioId, true);

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
                usuario = relatedUsuario
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
                    // 1. Faz upload para o Supabase (em background, não bloqueia)
                    await UploadToSupabaseAsync(file, newFileName); // Fire and forget
        
                    string relativePath = Path.Combine("/documents", newFileName).Replace(Path.DirectorySeparatorChar, '/');
                    
                    tipoArquivo type = fileExtension switch
                    {
                        ".jpeg" or ".jpg" or ".png" => tipoArquivo.imagem,
                        ".pdf" => tipoArquivo.pdf,
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
            tipoArquivo fileType = results.Count > 0 ? results[0].FileType : tipoArquivo.imagem;
        
            return (diretorio1, diretorio2, fileType);
        }
        
        // Novo método para upload assíncrono ao Supabase
        private async Task UploadToSupabaseAsync(IFormFile file, string fileName)
        {
            try
            {
                // Converter o arquivo para byte[]
                await using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                byte[] fileBytes = memoryStream.ToArray();
        
                // Fazer upload usando byte[]
                var result = await _supabaseClient.Storage
                    .From("study-documents") // Nome do seu bucket no Supabase
                    .Upload(fileBytes, $"documents/{fileName}");
        
                logger.Information("Upload para Supabase realizado: {Result}", result);
            }
            catch (Exception ex)
            {
                // Log do erro sem interromper o fluxo principal
                logger.Error(ex, "Erro no upload para Supabase para o arquivo: {FileName}", fileName);
            }
        }
        
        public async Task DeleteDocumento(int idDocumento, int idUsuario)
        {
            DocumentoModel documento = await documentoRepository.GetDocumentoById(idDocumento);

            if(documento.usuario.tipoUsuario.Equals(UserRole.User)
                && documento.usuario.idUsuario !=idUsuario)
                throw new ArgumentException("usuário não tem permissão para excluir esse documento.");

            /*if (documento.usuario.tipoUsuario.Equals(UserRole.Prof)
                && documento.fkProfessor != idUsuario)
                throw new ArgumentException("usuário não tem permissão para excluir esse documento.");
            */
            
            await DeleteFromSupabaseAsync(documento.diretorioMaterial1, documento.diretorioMaterial2);
            
            await documentoRepository.DeleteDocumento(idDocumento);

            await documentoRepository.Flush();
        }
        
        private async Task DeleteFromSupabaseAsync(string filePath1, string filePath2)
        {
            try
            {
                var filesToDelete = new List<string>();
        
                // Extrair nomes dos arquivos do path local para o Supabase
                if (!string.IsNullOrEmpty(filePath1))
                {
                    string supabasePath1 = filePath1.TrimStart('/');
                    filesToDelete.Add(supabasePath1);
                }
        
                if (!string.IsNullOrEmpty(filePath2))
                {
                    string supabasePath2 = filePath1.TrimStart('/');
                    filesToDelete.Add(supabasePath2);
                }
        
                if (filesToDelete.Any())
                {
                    await _supabaseClient.Storage
                        .From("study-documents")
                        .Remove(filesToDelete);
                        
                    logger.Information("Arquivos removidos do Supabase: {FileCount} arquivos", filesToDelete.Count);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Erro ao remover arquivos do Supabase: {FilePath1}, {FilePath2}", filePath1, filePath2);
            }
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

            var denunciaReadResult = result.Select(_denunciaModelMapper.DenunciaModelMapperToDenunciaReadModel)
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

        public async Task CreateDenuncia(int idDocumento, int idUsuario, string descricao)
        {
            DocumentoModel? relatedDocumento = await documentoRepository.GetDocumentoById(idDocumento);

            UsuarioModel? relatedUsuario = await usuarioRepository.GetUsuarioById(idUsuario, true);

            bool checkDenunciaAlreadyExists = await documentoRepository.CheckDenunciaAlreadyExists(idDocumento, idUsuario);

            if (!checkDenunciaAlreadyExists)
            {
                DenunciaModel novaDenuncia = new()
                {
                    usuario = relatedUsuario,
                    documento = relatedDocumento,
                    dataDenuncia = DateOnly.FromDateTime(DateTime.Now),
                    statusDenuncia = statusDenunciaEnum.Analise, 
                    descricao = descricao
                };

                await documentoRepository.CreateDenuncia(novaDenuncia);

                await documentoRepository.Flush();
            }

        }
    }
}
