using Riok.Mapperly.Abstractions;
using StudyLabAPI.Models;

namespace StudyLabAPI.Mapper;

[Mapper(ThrowOnMappingNullMismatch = false)]
public partial class DisciplinaModelMapper
{
    [UseMapper]
    private readonly CursoModelMapper _cursoModelMapper = new();

    [MapProperty(nameof(DisciplinaModel.idDisciplina), nameof(DisciplinaReadModel.idDisciplina))]
    [MapProperty(nameof(DisciplinaModel.codigoDisciplina), nameof(DisciplinaReadModel.codigoDisciplina))]
    [MapProperty(nameof(DisciplinaModel.professorDisciplina), nameof(DisciplinaReadModel.professorDisciplina))]
    [MapProperty(nameof(DisciplinaModel.professor), nameof(DisciplinaReadModel.professor))]
    [MapProperty(nameof(DisciplinaModel.nomeDisciplina), nameof(DisciplinaReadModel.nomeDisciplina))]
    [MapProperty(nameof(DisciplinaModel.quantidadeAluno), nameof(DisciplinaReadModel.quantidadeAluno))]
    public partial DisciplinaReadModel DisciplinaModelToDisciplinaReadModel(DisciplinaModel model);
}