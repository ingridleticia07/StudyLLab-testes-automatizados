using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public interface IDocumentoRepository
    {
        public Task<IList<DocumentoModel>> GetAllDocumentos(int page, int pageSize, int? idDisciplina, int? idTopico);

        public Task<(IList<DocumentoModel>, int, int)> GetDocumentosAndCount(int page, int pageSize, int? idDisciplina, int? idTopico);

        public Task CreateDocumento(DocumentoModel documento);

        public Task UpdateDocumento(DocumentoModel documentoUpdate);

        public Task<List<DocumentoModel?>> GetAllDocumentos();

        public Task<List<DocumentoModel?>> GetDocumentoByTopico(TopicoDiscussaoModel topico);

        public Task<DocumentoModel?> GetDocumentoById(int idDocumento);
        public Task DeleteDocumento(int idDocumento);
        public Task Flush();
    }
}
