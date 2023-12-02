using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public interface IDocumentoRepository
    {
        public Task CreateDocumento(DocumentoModel documento);

        public Task UpdateDocumento(DocumentoModel documentoUpdate);

        public Task<List<DocumentoModel?>> GetAllDocumentos();

        public Task<List<DocumentoModel?>> GetDocumentoByTopico(TopicoDiscussaoModel topico);
        public Task DeleteDocumento(int idDocumento);
        public Task Flush();
    }
}
