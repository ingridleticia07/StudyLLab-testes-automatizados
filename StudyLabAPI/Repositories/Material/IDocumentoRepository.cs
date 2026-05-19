using StudyLabAPI.Models;
using StudyLabAPI.Models.Forum;
using StudyLabAPI.Models.Material;
using StudyLabAPI.Models.Material.DTOs;

namespace StudyLabAPI.Repositories.Material
{
    public interface IDocumentoRepository
    {
        public Task<IList<DocumentoModel>> GetAllDocumentos(int page, int pageSize, int? idDisciplina, int? idTopico, bool isAnyStatus);

        public Task<(IList<DocumentoModel>, int, int)> GetDocumentosAndCount(int page, int pageSize, int? idDisciplina, int? idTopico, bool isAnyStatus);

        public Task CreateDocumento(DocumentoModel documento);

        public Task CreateDenuncia(DenunciaModel denuncia);

        public Task<bool> CheckDenunciaAlreadyExists(int idDocumento, int idUsuario);

        public Task UpdateDocumento(DocumentoModel documentoUpdate);

        public Task UpdateDenunciaStatus(DenunciaReadModel denunciaUpdate);

        public Task<List<DocumentoModel?>> GetAllDocumentos();

        public Task<List<DocumentoModel?>> GetDocumentoByTopico(TopicoDiscussaoModel topico);

        public Task<DocumentoModel?> GetDocumentoById(int idDocumento);
        public Task DeleteDocumento(int idDocumento);

        public Task<IList<DenunciaModel>> GetAllDenuncias(int page, int pageSize);

        public Task<(IList<DenunciaModel>, int, int)> GetDenunciasAndCount(int page, int pageSize);

        public Task Flush();
    }
}
