using StudyLabAPI.Mapper;
using StudyLabAPI.Models;
using StudyLabAPI.Repositories;
using StudyLabAPI.Validators.CustomValidators.RequestQuery;
using ILogger = Serilog.ILogger;
using ValidationException = StudyLabAPI.Exceptions.ValidationException;
namespace StudyLabAPI.Controllers
{
    public class DisciplinaController : IDisciplinaController
    {
        private IDisciplinaRepository disciplinaRepository { get; }
        private ILogger logger { get; }

        private ICursoRepository cursoRepository { get; }

        private readonly DisciplinaModelMapper _disciplinaModelMapper;

        public DisciplinaController(IDisciplinaRepository disciplinaRepository, 
            DisciplinaModelMapper disciplinaModelMapper,
            ICursoRepository cursoRepository,
            ILogger logger)
        {
            _disciplinaModelMapper = disciplinaModelMapper;
            this.disciplinaRepository = disciplinaRepository;
            this.logger = logger;
            this.cursoRepository = cursoRepository;
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
        public async Task<DisciplinaListResponse> GetAllDisciplinas(int page,int pageSize)
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
                .GetDisciplinasAndCount(page, pageSize);

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
