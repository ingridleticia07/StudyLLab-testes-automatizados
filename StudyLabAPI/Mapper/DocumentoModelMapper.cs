using Riok.Mapperly.Abstractions;
using StudyLabAPI.Models;

namespace StudyLabAPI.Mapper
{
    [Mapper(ThrowOnMappingNullMismatch = false)]
    public partial class DocumentoModelMapper
    {
        [UseMapper]
        private readonly TopicoDiscussaoModelMapper _topicoDiscussaoModelMappe = new();

        [MapProperty(nameof(DocumentoModel.idDocumento), nameof(DocumentoReadModel.idDocumento))]
        [MapProperty(nameof(DocumentoModel.topico), nameof(DocumentoReadModel.topico))]
        [MapProperty(nameof(DocumentoModel.tipoArquivo), nameof(DocumentoReadModel.tipoArquivo))]
        [MapProperty(nameof(DocumentoModel.tipoMaterial), nameof(DocumentoReadModel.tipoMaterial))]
        [MapProperty(nameof(DocumentoModel.dataCadastro), nameof(DocumentoReadModel.dataCadastro))]
        public partial DocumentoReadModel DocumentoModelMapperToDocumentoReadModel(DocumentoModel model);
    }
}
