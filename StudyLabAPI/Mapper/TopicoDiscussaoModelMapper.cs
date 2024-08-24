using Riok.Mapperly.Abstractions;
using StudyLabAPI.Models;

namespace StudyLabAPI.Mapper;

[Mapper(ThrowOnMappingNullMismatch = false)]
public partial class TopicoDiscussaoModelMapper
{
    [UseMapper]
    private readonly DisciplinaModelMapper _disciplinaModelMapper = new();

    [MapProperty(nameof(TopicoDiscussaoModel.idTopico), nameof(TopicoDiscussaoReadModel.idTopico))]
    [MapProperty(nameof(TopicoDiscussaoModel.dataTopico), nameof(TopicoDiscussaoReadModel.dataTopico))]
    [MapProperty(nameof(TopicoDiscussaoModel.nomeTopico), nameof(TopicoDiscussaoReadModel.nomeTopico))]
    public partial TopicoDiscussaoReadModel TopicoDiscussaoModelToDiscussaoReadModel(TopicoDiscussaoModel model);
}