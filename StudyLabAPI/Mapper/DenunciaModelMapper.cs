using Riok.Mapperly.Abstractions;
using StudyLabAPI.Models;

namespace StudyLabAPI.Mapper
{
    [Mapper(ThrowOnMappingNullMismatch = false)]
    public partial class DenunciaModelMapper
    {
        [UseMapper]
        private readonly UsuarioModelMapper _usuarioModelMapper= new();

        [MapProperty(nameof(DenunciaModel.idDenuncia), nameof(DenunciaReadModel.idDenuncia))]
        [MapProperty(nameof(DenunciaModel.statusDenuncia), nameof(DenunciaReadModel.statusDenuncia))]
        [MapProperty(nameof(DenunciaModel.dataDenuncia), nameof(DenunciaReadModel.dataDenuncia))]
        [MapProperty(nameof(DenunciaModel.usuario), nameof(DenunciaReadModel.usuario))]
        [MapProperty(nameof(DenunciaModel.documento), nameof(DenunciaReadModel.documento))]
        public partial DenunciaReadModel UsuarioModelMapperToDenunciaReadModel(DenunciaModel model);
    }
}
