using StudyLabAPI.Models;
using StudyLabAPI.Models.Enums;

namespace StudyLabAPI.Controllers
{
    public interface IDocumentoController
    {
        public Task<DocumentoListResponse?> GetAllDocumentosByDisciplinaOrTopico(int page, int pageSize, int? idDisciplina, int? idTopico, bool isAnyStatus);

        public Task<DenunciaListResponse?> GetAllDenuncias(int page, int pageSize);

        public Task<DocumentoModel?> CreateDocumento(RegisteredDocumentoModel documento, List<IFormFile> file);

        public Task CreateDenuncia(int idDocumento, int idUsuario);

        public Task<DenunciaReadModel> UpdateDenunciaStatus(DenunciaReadModel denuncia);

        public Task<DocumentoModel?> UpdateDocumento(RegisteredDocumentoModel documentoUpdate);

        public Task<List<DocumentoModel?>> GetAllDocumentos();

        public Task<List<DocumentoModel>> GetDocumentoByTopico(RegisteredDocumentoModel topico);

        public Task DeleteDocumento(int idDocumento, int idUsuario);
    }
}
