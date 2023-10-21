using StudyLabAPI.Models;
using StudyLabAPI.Repositories;
using ILogger = Serilog.ILogger;
namespace StudyLabAPI.Controllers
{
    public class DisciplinaController : IDisciplinaController
    {
        private IDisciplinaRepository disciplinaRepository { get; }
        private ILogger logger { get; }

        private ICursoRepository cursoRepository { get; }

        public DisciplinaController(IDisciplinaRepository disciplinaRepository, ICursoRepository cursoRepository,
            ILogger logger)
        {
            this.disciplinaRepository = disciplinaRepository;
            this.logger = logger;
            this.cursoRepository = cursoRepository;
        }
        public async Task<DisciplinaReadModel> GetDisciplinaById(int id)
        {
            DisciplinaModel? disciplinasListadas = await disciplinaRepository.GetDisciplinaById(id);
            if (disciplinasListadas is null)
            {
                return (DisciplinaReadModel)Results.Ok("oo");
            }
            return new()
            {
                idDisciplina = disciplinasListadas.idDisciplina,
                nomeDisciplina = disciplinasListadas.nomeDisciplina,
                professorDisciplina = disciplinasListadas.professorDisciplina,
                curso = (disciplinasListadas.curso != null) ? new (disciplinasListadas.curso.nomeCurso) : null

            };
        }
        public async Task<List<DisciplinaReadModel>> GetAllDisciplinas()
        {
            // Implement your logic to get all DisciplinaModel objects
            // You can use your repository to fetch the data
            List<DisciplinaModel> disciplinasListadas = await disciplinaRepository.GetAllDisciplinas();
            // You should map DisciplinaModel to DisciplinaReadModel and return the list
            List<DisciplinaReadModel> result = disciplinasListadas.Select(disciplina => new DisciplinaReadModel
            {
                idDisciplina = disciplina.idDisciplina,
                nomeDisciplina = disciplina.nomeDisciplina,
                professorDisciplina = disciplina.professorDisciplina,
                quantidadeAluno = disciplina.quantidadeAluno,
                curso = (disciplina.curso != null) ? new (disciplina.curso.nomeCurso) : null,
                codigoDisciplina = disciplina.codigoDisciplina

            }).ToList();

            return result;
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
        public async Task<bool> VerifyDisciplinaCreatedWithId(RegisterDisciplinaRequestModel disciplinaModel)
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
            bool returnCheckDisciplinaExists = await disciplinaRepository.VerifyDisciplinaCreatedWithId(novaDisciplina);
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

        public async Task DeleteDisciplina(DisciplinaModel disciplina)
        {
            //verificar se disciplina existe, por meio do buscar disciplina
            //para em caso de exstir, excluir a mesma
            await disciplinaRepository.DeleteDisciplina(disciplina.idDisciplina);
            await disciplinaRepository.Flush();
        }
    }
}
