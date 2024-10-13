using StudyLabAPI.Models;
using StudyLabAPI.Repositories;
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

        public DocumentoController(ITopicoDiscussaoRepository topicoDiscussaoRepository,
            IDisciplinaRepository DisciplinaRepository, IUsuarioRepository usuarioRepository,
            IRespostaForumRepository respostaForumRepository, IForumRepository forumRepository,
            IDocumentoRepository documentoRepository, ILogger logger)
        {
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
            
            DocumentoModel novoDocumento = new()
            {
                dataCadastro = DateOnly.FromDateTime(DateTime.Now),
                diretorioMaterial = documento.diretorioMaterial,
                tipoMaterial = documento.TipoMaterial,
                topico = relatedTopico,
                tipoArquivo = documento.tipoArquivo,
                usuario = relatedUsuario
            };

            string diretorio = await MoveDocumentFileAsync(file);

            novoDocumento.diretorioMaterial = diretorio;

            await documentoRepository.CreateDocumento(novoDocumento);

            await documentoRepository.Flush();

            return (novoDocumento);
        }

        private async Task<string> MoveDocumentFileAsync(IFormFile file)
        {
            // Validate the uploaded file
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("No file uploaded.");
            }

            // Get the file extension from the uploaded file
            string fileExtension = Path.GetExtension(file.FileName);
            string newFileName = $"document_{Guid.NewGuid()}{fileExtension}"; // Generate a unique file name

            // Define the destination directory
            string destinationDirectory = Path.Combine("..", "StudylabWeb", "documents");

            // Ensure the destination directory exists
            Directory.CreateDirectory(destinationDirectory); // Create directory if it doesn't exist

            // Create the full path for the destination file
            string destinationFilePath = Path.Combine(destinationDirectory, newFileName);

            // Save the file to the specified path
            using (var stream = new FileStream(destinationFilePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return destinationFilePath;
        }


        public async Task DeleteDocumento(RegisteredDocumentoModel documento)
        {
            await documentoRepository.DeleteDocumento(documento.idDocumento);

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
    }
}
