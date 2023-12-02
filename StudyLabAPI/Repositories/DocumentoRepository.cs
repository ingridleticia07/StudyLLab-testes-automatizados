using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Context;
using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public class DocumentoRepository : IDocumentoRepository
    {

        private AppDbContext dbContext { get; }
        public DocumentoRepository(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task CreateDocumento(DocumentoModel documento) =>
            await dbContext.documento.AddAsync(documento);

        public async Task DeleteDocumento(int idDocumento)
        {
            DocumentoModel documentoModel = await dbContext.documento.FindAsync(idDocumento);
            if (documentoModel != null)
            {
                dbContext.documento.Remove(documentoModel);
            }
        }

        public async Task Flush() =>
            await dbContext.SaveChangesAsync();

        public async Task<List<DocumentoModel?>> GetAllDocumentos()
        {
            List<DocumentoModel> documentoModel = await dbContext.documento
            .Include(value => value.topico).ToListAsync();

            return documentoModel;
        }

        public async Task<List<DocumentoModel?>> GetDocumentoByTopico(TopicoDiscussaoModel topico)
        {
            List<DocumentoModel> documentoModel = await dbContext.documento
           .Where(value => value.topico == topico).Include(value => value.topico)
           .ToListAsync();

            return documentoModel;
        }


        public async Task UpdateDocumento(DocumentoModel documentoUpdate)
        {
            DocumentoModel documentoForUpdate = await dbContext.documento.FindAsync(documentoUpdate.idDocumento);

            if (documentoForUpdate == null)
            {
                return;
            }

            documentoForUpdate.dataCadastro = documentoUpdate.dataCadastro;
            documentoForUpdate.diretorioMaterial = documentoUpdate.diretorioMaterial;
            documentoForUpdate.topico = documentoUpdate.topico;
            documentoForUpdate.tipoMaterial = documentoUpdate.tipoMaterial;
        }
    }
}
