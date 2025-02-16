using Riok.Mapperly.Abstractions;
using StudyLabAPI.Models;

namespace StudyLabAPI.Mapper
{
    [Mapper(ThrowOnMappingNullMismatch = false)]
    public partial class RespotaForumModelMapper
    {
        [UseMapper]
        private readonly TopicoDiscussaoModelMapper _topicoDiscussaoModelMappe = new();

        [MapProperty(nameof(RespostaForumModel.idResposta), nameof(RespostaForumReadModel.idResposta))]
        [MapProperty(nameof(RespostaForumModel.topicoDiscussao), nameof(RespostaForumReadModel.topicoDiscussao))]
        [MapProperty(nameof(RespostaForumModel.resposta), nameof(RespostaForumReadModel.resposta))]
        [MapProperty(nameof(RespostaForumModel.dataResposta), nameof(RespostaForumReadModel.dataResposta))]
        [MapProperty(nameof(RespostaForumModel.topicoDiscussao), nameof(RespostaForumReadModel.topicoDiscussao))]
        [MapProperty(nameof(RespostaForumModel.usuario), nameof(RespostaForumReadModel.usuario))]
        public partial RespostaForumReadModel RespotaForumModelMapperToRespostaForumReadModel(RespostaForumModel model);
    }
}
