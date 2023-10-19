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
                curso = (disciplina.curso != null) ? new (disciplina.curso.nomeCurso) : null,
                codigoDisciplina = disciplina.codigoDisciplina

            }).ToList();

            return result;
        }
        public async Task<(DisciplinaReadModel, string)> CreateDisciplina(RegisterDisciplinaRequestModel disciplinaModel)
        {
            //passar id 
            int cursoId = int.Parse(disciplinaModel.idDisciplina);

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
            DisciplinaReadModel novaDisciplina2 = new()
            {
                nomeDisciplina = disciplinaModel.nomeDisciplina,
                professorDisciplina = disciplinaModel.professorDisciplina,
                codigoDisciplina = disciplinaModel.codigoDisciplina
            };

            return (novaDisciplina2,"okokok");
        }

    }
}
