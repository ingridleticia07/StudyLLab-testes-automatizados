using Microsoft.AspNetCore.Mvc;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Models;
using StudyLabAPI.Repositories;
using System.Collections.Generic;
using ILogger = Serilog.ILogger;
namespace StudyLabAPI.Controllers
{
    public class DisciplinaController : IDisciplinaController
    {
        private IDisciplinaRepository disciplinaRepository { get; }
        private ILogger logger { get; }

        public DisciplinaController(IDisciplinaRepository disciplinaRepository, ILogger logger)
        {
            this.disciplinaRepository = disciplinaRepository;
            this.logger = logger;
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
        public async Task<List<DisciplinaReadModel>> GetAllDisciplina()
        {
            // Implement your logic to get all DisciplinaModel objects
            // You can use your repository to fetch the data
            List<DisciplinaModel> disciplinasListadas = await disciplinaRepository.GetAllDisciplina();
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


    }
}
