using StudyLabAPI.Mapper;
using StudyLabAPI.Models.Curso;
using StudyLabAPI.Models.Disciplina;
using StudyLabAPI.Models.Disciplina.DTOs;
using StudyLabAPI.Repositories.Auth;
using StudyLabAPI.Repositories.Curso;
using StudyLabAPI.Repositories.Disciplina;
using StudyLabAPI.Repositories.Forum;
using StudyLabAPI.Repositories.Material;
using StudyLabAPI.Repositories.User;
using StudyLabAPI.Validators.CustomValidators.RequestQuery;
using ILogger = Serilog.ILogger;
using ValidationException = StudyLabAPI.Exceptions.ValidationException;
namespace StudyLabAPI.Services.Application.Disciplina
{
    public class DisciplinaService : IDisciplinaService
    {
        private IDisciplinaRepository disciplinaRepository { get; }

        private IUsuarioRepository usuarioRepository { get; }
        private ILogger logger { get; }

        private ICursoRepository cursoRepository { get; }

        private readonly DisciplinaModelMapper _disciplinaModelMapper;

        public DisciplinaService(IDisciplinaRepository disciplinaRepository, 
            DisciplinaModelMapper disciplinaModelMapper,
            ICursoRepository cursoRepository,IUsuarioRepository usuarioRepository,
            ILogger logger)
        {
            _disciplinaModelMapper = disciplinaModelMapper;
            this.disciplinaRepository = disciplinaRepository;
            this.logger = logger;
            this.cursoRepository = cursoRepository;
            this.usuarioRepository = usuarioRepository;
        }
        public async Task<DisciplinaReadModel> GetDisciplinaById(int id)
        {
            DisciplinaModel? disciplinasListadas = await disciplinaRepository.GetDisciplinaById(id);

            CursoModel? relatedCurso = await cursoRepository.GetCursoById(disciplinasListadas.curso.idCurso);

            return new() 
            {
                idDisciplina = disciplinasListadas.idDisciplina,
                nomeDisciplina = disciplinasListadas.nomeDisciplina,
                professorDisciplina = disciplinasListadas.professorDisciplina,
                quantidadeAluno = disciplinasListadas.quantidadeAluno,
                codigoDisciplina = disciplinasListadas.codigoDisciplina,
                curso = relatedCurso
            };
        }

        public async Task<List<DisciplinaModel?>> GetAllDisciplinas()
        {
            List<DisciplinaModel?> disciplinas = await disciplinaRepository.GetAllDisciplinas();

            return disciplinas;
        } 
        public async Task<DisciplinaListResponse> GetAllDisciplinasWithPagination(int page,int pageSize, int idCurso)
        {
            logger.Information("Validando parâmetros de paginação: Page[{Page}] PageSize[{PageSize}]",
            page, pageSize);

            PageValidator validator = new(page, pageSize);

            if (!validator.isValid)
            {
                ValidationException exception = new(["Parâmetros de paginação inválidos"]);
                logger.Error(exception, "Parâmetros de paginação inválidos");
                throw exception;
            }

            logger.Information("Recuperando disciplinas da página Page[{Page}] PageSize[{PageSize}]",
                page, pageSize);

            (var result, int resultCount, int disciplinaCount) = await disciplinaRepository
                .GetDisciplinasAndCount(page, pageSize, idCurso);

            var disciplinaReadResult = result.Select(_disciplinaModelMapper.DisciplinaModelToDisciplinaReadModel)
                .ToList();

            logger.Information("Recuperado {Count} usuários da página Page[{Page}] PageSize[{PageSize}]",
                disciplinaReadResult.Count, page, pageSize);
            logger.Information("Recuperando informações extras para a resposta");

            int maxPage = disciplinaCount / pageSize;
            if (disciplinaCount % pageSize != 0)
                maxPage++;

            return new()
            {
                maxPage = maxPage,
                disciplinaCount = disciplinaCount,
                pageCount = resultCount,
                disciplinas = disciplinaReadResult
            };
        }

        public async Task<bool> VerifyDisciplinaCreated(RegisterDisciplinaRequestModel disciplinaModel)
        {
            int cursoId = disciplinaModel.curso;

            CursoModel? relatedCurso = await cursoRepository.GetCursoById(cursoId);

            DisciplinaModel novaDisciplina = new()
            {
                idDisciplina = disciplinaModel.idDisciplina,
                nomeDisciplina = disciplinaModel.nomeDisciplina,
                professorDisciplina = disciplinaModel.professorDisciplina,
                curso = relatedCurso,
                quantidadeAluno = disciplinaModel.quantidadeAluno,
                codigoDisciplina = disciplinaModel.codigoDisciplina
            };
            bool returnCheckDisciplinaExists = await disciplinaRepository.VerifyDisciplinaCreated(novaDisciplina);
            return returnCheckDisciplinaExists;
        }
        public async Task<bool> VerifyDisciplinaCreatedWithId(int disciplinaId)
        {
            bool returnCheckDisciplinaExists = await disciplinaRepository.VerifyDisciplinaCreatedWithId(disciplinaId);
            return returnCheckDisciplinaExists;
        }

        public async Task<DisciplinaReadModel> CreateDisciplina(RegisterDisciplinaRequestModel disciplinaModel)
        {
            //passar id 
            int cursoId = disciplinaModel.curso;

            CursoModel? relatedCurso = await cursoRepository.GetCursoById(cursoId);

            DisciplinaModel novaDisciplina = new()
            {
                nomeDisciplina = disciplinaModel.nomeDisciplina,
                professorDisciplina = disciplinaModel.professorDisciplina,
                curso = relatedCurso,
                quantidadeAluno = disciplinaModel.quantidadeAluno,
                codigoDisciplina = disciplinaModel.codigoDisciplina
            };

            await disciplinaRepository.CreateDisciplina(novaDisciplina);
            await disciplinaRepository.Flush();

            DisciplinaReadModel novaDisciplinaRetorno = new()
            {
                nomeDisciplina = disciplinaModel.nomeDisciplina,
                professorDisciplina = disciplinaModel.professorDisciplina,
                codigoDisciplina = disciplinaModel.codigoDisciplina
            };

            return (novaDisciplinaRetorno);
        }

        public async Task<DisciplinaReadModel> UpdateDisciplina(RegisterDisciplinaRequestModel disciplinaModel)
        {
            int cursoId = disciplinaModel.curso;

            CursoModel? relatedCurso = await cursoRepository.GetCursoById(cursoId);

            DisciplinaModel DisciplinaUpdateObj = new()
            {
                idDisciplina = disciplinaModel.idDisciplina,
                nomeDisciplina = disciplinaModel.nomeDisciplina,
                professorDisciplina = disciplinaModel.professorDisciplina,
                curso = relatedCurso,
                quantidadeAluno = disciplinaModel.quantidadeAluno,
                codigoDisciplina = disciplinaModel.codigoDisciplina
            };
            await disciplinaRepository.UpdateDisciplina(DisciplinaUpdateObj);
            await disciplinaRepository.Flush();

            DisciplinaReadModel DisciplinaReturnUpdateObj = new()
            {
                nomeDisciplina = disciplinaModel.nomeDisciplina,
                professorDisciplina = disciplinaModel.professorDisciplina,
                codigoDisciplina = disciplinaModel.codigoDisciplina
            };

            return (DisciplinaReturnUpdateObj);
        }

        public async Task DeleteDisciplina(int disciplinaIdentifier)
        {
            //para em caso de exstir, excluir a mesma

            bool disciplinaExists = await disciplinaRepository.VerifyDisciplinaCreatedWithId(disciplinaIdentifier);

            if (disciplinaExists == true)
            {
                await disciplinaRepository.DeleteDisciplina(disciplinaIdentifier);
                await disciplinaRepository.Flush();
            }
        }
    }
}
