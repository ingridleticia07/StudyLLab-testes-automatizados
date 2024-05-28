using Riok.Mapperly.Abstractions;
using StudyLabAPI.Models;

namespace StudyLabAPI.Mapper;

[Mapper(ThrowOnMappingNullMismatch = false)]
public partial class UsuarioModelMapper
{
    [UseMapper]
    private readonly CursoModelMapper _cursoModelMapper = new();
    
    [MapProperty(nameof(UsuarioModel.idUsuario), nameof(UserReadModel.id))]
    [MapProperty(nameof(UsuarioModel.nomeUsuario), nameof(UserReadModel.username))]
    [MapProperty(nameof(UsuarioModel.emailUsuario), nameof(UserReadModel.email))]
    [MapProperty(nameof(UsuarioModel.tipoUsuario), nameof(UserReadModel.role))]
    [MapProperty(nameof(UsuarioModel.statusUsuario), nameof(UserReadModel.active))]
    [MapProperty(nameof(UsuarioModel.imagemUsuario), nameof(UserReadModel.imagem))]
    public partial UserReadModel UsuarioModelToUserReadModel(UsuarioModel model);
}