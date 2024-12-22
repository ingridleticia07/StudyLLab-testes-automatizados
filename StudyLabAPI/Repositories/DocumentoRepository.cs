using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Context;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Enums;

namespace StudyLabAPI.Repositories
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
        public async Task<IList<DocumentoModel>> GetAllDocumentos(AppDbContext inDbContext, int page, int pageSize, int? idDisciplina, int? idTopico, bool isAnyStatus)
        {
            var result = new List<DocumentoModel>();

            if (isAnyStatus)
            {
                if (idDisciplina != 0 && idTopico != 0)
                {
                    result = await inDbContext.documento
                    .AsNoTracking()
                    .Where(f => f.topico.idTopico == idTopico && f.topico.disciplina.idDisciplina == idDisciplina)
                    .OrderByDescending(f => f.idDocumento)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Include(f => f.topico)
                    .ThenInclude(td => td.disciplina)
                    .Include(f => f.usuario)
                    .ToListAsync();
                }
                else if (idDisciplina != 0 || idTopico != 0)
                {
                    result = await inDbContext.documento
                    .AsNoTracking()
                    .Where(f => f.topico.idTopico == idTopico || f.topico.disciplina.idDisciplina == idDisciplina)
                    .OrderByDescending(f => f.idDocumento)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Include(f => f.topico)
                    .ThenInclude(td => td.disciplina)
                    .Include(f => f.usuario)
                    .ToListAsync();

                }
                else
                {
                    result = await inDbContext.documento
                    .AsNoTracking()
                    .OrderByDescending(f => f.idDocumento)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Include(f => f.topico)
                    .ThenInclude(td => td.disciplina)
                    .Include(f => f.usuario)
                    .ToListAsync();
                }
            }
            else
            {
                if (idDisciplina != 0 && idTopico != 0)
                {
                    result = await inDbContext.documento
                    .AsNoTracking()
                    .Where(f => f.topico.idTopico == idTopico && f.topico.disciplina.idDisciplina == idDisciplina && f.status == statusDocumentoEnum.aprovado)
                    .OrderByDescending(f => f.idDocumento)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Include(f => f.topico)
                    .ThenInclude(td => td.disciplina)
                    .Include(f => f.usuario)
                    .ToListAsync();
                }
                else if (idDisciplina != 0 || idTopico != 0)
                {
                    result = await inDbContext.documento
                    .AsNoTracking()
                    .Where(f => f.topico.idTopico == idTopico || f.topico.disciplina.idDisciplina == idDisciplina && f.status == statusDocumentoEnum.aprovado)
                    .OrderByDescending(f => f.idDocumento)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Include(f => f.topico)
                    .ThenInclude(td => td.disciplina)
                    .Include(f => f.usuario)
                    .ToListAsync();

                }
                else
                {
                    result = await inDbContext.documento
                    .AsNoTracking()
                    .Where(f => f.status == statusDocumentoEnum.aprovado)
                    .OrderByDescending(f => f.idDocumento)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Include(f => f.topico)
                    .ThenInclude(td => td.disciplina)
                    .Include(f => f.usuario)
                    .ToListAsync();
                }
            }

            return result.Select(resposta => new DocumentoModel
            {
                idDocumento = resposta.idDocumento,
                diretorioMaterial1 = resposta.diretorioMaterial1,
                diretorioMaterial2 = resposta.diretorioMaterial2,
                tipoArquivo = resposta.tipoArquivo,
                status = resposta.status,
                tipoMaterial = resposta.tipoMaterial,
                dataCadastro = resposta.dataCadastro,
                topico = resposta.topico,
                professor = resposta.professor,
                usuario = new UsuarioModel
                {
                    idUsuario = resposta.usuario.idUsuario,
                    emailUsuario = null,
                    matricula = null,
                    senhaUsuario = null,
                    statusUsuario = false,
                    tipoUsuario = default,
                    curso = null,
                    nomeUsuario = resposta.usuario.nomeUsuario,
                    dataCadastroUsuario = default,
                    imagemUsuario = null
                }
            }).ToList();
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
                    count = await inDbContext.documento.Where(f => f.topico.idTopico == idTopico || f.topico.disciplina.idDisciplina == idDisciplina && f.status == statusDocumentoEnum.aprovado).CountAsync();

                else if (idTopico != 0 && idDisciplina != 0)
                    count = await inDbContext.documento.Where(f => f.topico.idTopico == idTopico && f.topico.disciplina.idDisciplina == idDisciplina && f.status == statusDocumentoEnum.aprovado).CountAsync();
                else
                    count = await inDbContext.documento.Where(f => f.status == statusDocumentoEnum.aprovado).CountAsync();
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
