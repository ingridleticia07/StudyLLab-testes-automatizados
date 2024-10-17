using StudyLabAPI.Models;

namespace StudyLabAPI.Controllers
{
    public interface IDocumentoController
    {
        public Task<DocumentoListResponse?> GetAllDocumentosByDisciplinaOrTopico(int page, int pageSize, int? idDisciplina, int? idTopico);

        public Task<DocumentoModel?> CreateDocumento(RegisteredDocumentoModel documento, IFormFile file);

        public Task<DocumentoModel?> UpdateDocumento(RegisteredDocumentoModel documentoUpdate);

        public Task<List<DocumentoModel?>> GetAllDocumentos();

        public Task<List<DocumentoModel>> GetDocumentoByTopico(RegisteredDocumentoModel topico);

        public Task DeleteDocumento(RegisteredDocumentoModel idDocumento);
    }
}
