using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Context;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Disciplina;
using StudyLabAPI.Models.Forum;
using StudyLabAPI.Models.Material;
using StudyLabAPI.Models.Material.DTOs;
using StudyLabAPI.Models.Material.Enums;
using StudyLabAPI.Models.User;

namespace StudyLabAPI.Repositories.Material
{
    public class DocumentoRepository : IDocumentoRepository
    {

        private AppDbContext dbContext { get; }

        private readonly IDbContextFactory<AppDbContext> _dbContextFactory;
        public DocumentoRepository(AppDbContext dbContext, IDbContextFactory<AppDbContext> dbContextFactory)
        {
            this.dbContext = dbContext;
            _dbContextFactory = dbContextFactory;
        }

        public async Task CreateDocumento(DocumentoModel documento) =>
            await dbContext.documento.AddAsync(documento);

        public async Task CreateDenuncia(DenunciaModel denuncia) =>
            await dbContext.denuncia.AddAsync(denuncia);

        public async Task<bool> CheckDenunciaAlreadyExists(int idDocumento, int idUsuario)
        {
            int isDenunciaAlreadyExists = await dbContext.denuncia
           .Where(value => value.usuario.idUsuario == idUsuario).Include(value => value.documento).CountAsync();

            if (isDenunciaAlreadyExists > 0)
                return true;

            return false;
        }

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

        public async Task<DocumentoModel?> GetDocumentoById(int idDocumento)
        {
            DocumentoModel documentoModel = await dbContext.documento.Include(value => value.usuario)
                .FirstOrDefaultAsync(d => d.idDocumento == idDocumento);

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
            documentoForUpdate.diretorioMaterial1 = documentoUpdate.diretorioMaterial1;
            documentoForUpdate.diretorioMaterial2 = documentoUpdate.diretorioMaterial2;
            documentoForUpdate.topico = documentoUpdate.topico;
            documentoForUpdate.tipoMaterial = documentoUpdate.tipoMaterial;
        }

        public async Task UpdateDenunciaStatus(DenunciaReadModel denuncia)
        {
            DenunciaModel denunciaForUpdate = await dbContext.denuncia
           .Where(value => value.idDenuncia == denuncia.idDenuncia).Include(value => value.documento).FirstOrDefaultAsync();

            if (denunciaForUpdate == null)
            {
                return;
            }

            denunciaForUpdate.statusDenuncia = denuncia.statusDenuncia;

            DocumentoModel documentoForUpdate = await dbContext.documento.FindAsync(denunciaForUpdate.documento.idDocumento);

            documentoForUpdate.status = denuncia.statusDocumento;
        }

        public Task<IList<DocumentoModel>> GetAllDocumentos(int page, int pageSize, int? idDisciplina, int? idTopico, bool isAnyStatus) =>
                GetAllDocumentos(dbContext, page, pageSize, idDisciplina, idTopico, isAnyStatus);
        public async Task<IList<DocumentoModel>> GetAllDocumentos(
            AppDbContext inDbContext, int page, int pageSize, int? idDisciplina, int? idTopico, bool isAnyStatus)
        {
            var query = inDbContext.documento
                .AsNoTracking()
                .AsQueryable();
        
            // filtro por status
            if (!isAnyStatus)
            {
                query = query.Where(f => f.status == StatusDocumento.Aprovado);
            }
        
            // filtro por disciplina e/ou t�pico
            if (idDisciplina != null && idDisciplina != 0 && idTopico != null && idTopico != 0)
            {
                query = query.Where(f => f.topico.idTopico == idTopico &&
                                         f.topico.disciplina.idDisciplina == idDisciplina);
            }
            else if ((idDisciplina != null && idDisciplina != 0) ||
                     (idTopico != null && idTopico != 0))
            {
                query = query.Where(f =>
                    (idTopico != null && idTopico != 0 && f.topico.idTopico == idTopico) ||
                    (idDisciplina != null && idDisciplina != 0 && f.topico.disciplina.idDisciplina == idDisciplina));
            }
        
            // pagina��o e proje��o: s� traz os campos que voc� realmente usa
            var documentos = await query
                .OrderByDescending(f => f.idDocumento)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(f => new DocumentoModel
                {
                    idDocumento = f.idDocumento,
                    diretorioMaterial1 = f.diretorioMaterial1,
                    diretorioMaterial2 = f.diretorioMaterial2,
                    tipoArquivo = f.tipoArquivo,
                    status = f.status,
                    tipoMaterial = f.tipoMaterial,
                    dataCadastro = f.dataCadastro,
        
                    topico = new TopicoDiscussaoModel
                    {
                        idTopico = f.topico.idTopico,
                        nomeTopico = f.topico.nomeTopico,
                        disciplina = new DisciplinaModel
                        {
                            idDisciplina = f.topico.disciplina.idDisciplina,
                            nomeDisciplina = f.topico.disciplina.nomeDisciplina,
                            professorDisciplina = f.topico.disciplina.professorDisciplina
                        }
                    },
        
                    usuario = new UsuarioModel
                    {
                        idUsuario = f.usuario.idUsuario,
                        nomeUsuario = f.usuario.nomeUsuario,
                        // dados sens�veis ficam nulos
                        emailUsuario = null,
                        matricula = null,
                        senhaUsuario = null,
                        statusUsuario = false,
                        tipoUsuario = default,
                        curso = null,
                        dataCadastroUsuario = default,
                        imagemUsuario = null
                    }
                })
                .ToListAsync();
        
            return documentos;
        }


        private async Task<IList<DocumentoModel>> GetDocumentosWFactory(int page, int pageSize, int? idDisciplina, int? idTopico, bool isAnyStatus)
        {
            await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

            if (inDbContext is null)
                throw new("Was not possible to instanciaite a new DbContext");

            return await GetAllDocumentos(inDbContext, page, pageSize, idDisciplina, idTopico, isAnyStatus);
        }

        private async Task<int> GetDocumentoForumCountWFactory(int? idTopico, int? idDisciplina, bool isAnyStatus)
        {
            await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

            if (inDbContext is null)
                throw new("Was not possible to instanciaite a new DbContext");

            return await GetDocumentosAndCount(inDbContext, idTopico, idDisciplina, isAnyStatus);
        }

        private async Task<int> GetDocumentosAndCount(AppDbContext inDbContext, int? idTopico, int? idDisciplina, bool isAnyStatus)
        {
            int count = 0;

            if (!isAnyStatus)
            {
                if (idTopico != 0 || idDisciplina != 0)
                    count = await inDbContext.documento.Where(f => f.topico.idTopico == idTopico || f.topico.disciplina.idDisciplina == idDisciplina && f.status == StatusDocumento.Aprovado).CountAsync();

                else if (idTopico != 0 && idDisciplina != 0)
                    count = await inDbContext.documento.Where(f => f.topico.idTopico == idTopico && f.topico.disciplina.idDisciplina == idDisciplina && f.status == StatusDocumento.Aprovado).CountAsync();
                else
                    count = await inDbContext.documento.Where(f => f.status == StatusDocumento.Aprovado).CountAsync();
            }
            else
            {
                if (idTopico != 0 || idDisciplina != 0)
                    count = await inDbContext.documento.Where(f => f.topico.idTopico == idTopico || f.topico.disciplina.idDisciplina == idDisciplina).CountAsync();

                else if (idTopico != 0 && idDisciplina != 0)
                    count = await inDbContext.documento.Where(f => f.topico.idTopico == idTopico && f.topico.disciplina.idDisciplina == idDisciplina).CountAsync();
                else
                    count = await inDbContext.documento.CountAsync();
            }

            return count;
        }

        public async Task<(IList<DocumentoModel>, int, int)> GetDocumentosAndCount(int page, int pageSize, int? idDisciplina, int? idTopico, bool isAnyStatus)
        {
            var respostasTask = GetDocumentosWFactory(page, pageSize, idDisciplina, idTopico, isAnyStatus);
            var respostasCountTask = GetDocumentoForumCountWFactory(idTopico, idDisciplina, isAnyStatus);
            await Task.WhenAll(respostasTask, respostasCountTask);

            var result = respostasTask.Result;
            int topicosCount = respostasCountTask.Result;
            return (result, result.Count, topicosCount);
        }

        public Task<IList<DenunciaModel>> GetAllDenuncias(int page, int pageSize) =>
                GetAllDenuncias(dbContext, page, pageSize);

        public async Task<IList<DenunciaModel>> GetAllDenuncias(AppDbContext inDbContext, int page, int pageSize)
        {
            var result = new List<DenunciaModel>();

            result = await inDbContext.denuncia
            .AsNoTracking()
            .OrderByDescending(f => f.idDenuncia)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(f => f.usuario)
            .ThenInclude(td => td.curso)
            .Include(td => td.documento)
            .ToListAsync();

            return result;
        }

        private async Task<IList<DenunciaModel>> GetDenunciasWFactory(int page, int pageSize)
        {
            await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

            if (inDbContext is null)
                throw new("Was not possible to instanciaite a new DbContext");

            return await GetAllDenuncias(inDbContext, page, pageSize);
        }

        private async Task<int> GetDocumentoDenunciasCountWFactory()
        {
            await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

            if (inDbContext is null)
                throw new("Was not possible to instanciaite a new DbContext");

            return await GetDenunciasAndCount(inDbContext);
        }

        private async Task<int> GetDenunciasAndCount(AppDbContext inDbContext)
        {
            int count = 0;

            count = await inDbContext.denuncia.CountAsync();

            return count;
        }

        public async Task<(IList<DenunciaModel>, int, int)> GetDenunciasAndCount(int page, int pageSize)
        {
            var denunciasTask = GetDenunciasWFactory(page, pageSize);
            var denunciasCountTask = GetDocumentoDenunciasCountWFactory();
            await Task.WhenAll(denunciasTask, denunciasCountTask);

            var result = denunciasTask.Result;
            int denunciasCount = denunciasCountTask.Result;
            return (result, result.Count, denunciasCount);
        }
    }
}
