using StudyLabAPI.Models.Material;
using StudyLabAPI.Models.Material.DTOs;

namespace StudyLabAPI.Services.Application.Documento
{
    public interface IDocumentoService
    {
        public Task<DocumentoListResponse?> GetAllDocumentosByDisciplinaOrTopico(int page, int pageSize, int? idDisciplina, int? idTopico, bool isAnyStatus);

        public Task<DenunciaListResponse?> GetAllDenuncias(int page, int pageSize);

        public Task<DocumentoModel?> CreateDocumento(RegisteredDocumentoModel documento, List<IFormFile> file);

        public Task CreateDenuncia(int idDocumento, int idUsuario, string descricao);

        public Task<DenunciaReadModel> UpdateDenunciaStatus(DenunciaReadModel denuncia);

        public Task<DocumentoModel?> UpdateDocumento(RegisteredDocumentoModel documentoUpdate);

        public Task<List<DocumentoModel?>> GetAllDocumentos();

        public Task<List<DocumentoModel>> GetDocumentoByTopico(RegisteredDocumentoModel topico);

        public Task DeleteDocumento(int idDocumento, int idUsuario);
    }
}
