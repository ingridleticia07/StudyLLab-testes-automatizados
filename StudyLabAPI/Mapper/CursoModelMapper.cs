using Riok.Mapperly.Abstractions;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Curso;
using StudyLabAPI.Models.Curso.DTOs;

namespace StudyLabAPI.Mapper;

[Mapper]
public partial class CursoModelMapper
{
    [MapperIgnoreSource(nameof(CursoModel.idCurso))]
    [MapProperty(nameof(CursoModel.nomeCurso), nameof(CursoReadModel.nome))]
    public partial CursoReadModel CursoModelToCursoReadModel(CursoModel model);
}