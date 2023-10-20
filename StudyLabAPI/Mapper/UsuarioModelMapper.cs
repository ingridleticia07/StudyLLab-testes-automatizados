using Riok.Mapperly.Abstractions;
using StudyLabAPI.Models;

namespace StudyLabAPI.Mapper;

[Mapper]
public partial class UsuarioModelMapper
{
    [MapProperty(nameof(UsuarioModel.idUsuario), nameof(UserReadModel.id))]
    [MapProperty(nameof(UsuarioModel.nomeUsuario), nameof(UserReadModel.username))]
    [MapProperty(nameof(UsuarioModel.emailUsuario), nameof(UserReadModel.email))]
    [MapProperty(nameof(UsuarioModel.tipoUsuario), nameof(UserReadModel.role))]
    [MapProperty(nameof(UsuarioModel.statusUsuario), nameof(UserReadModel.active))]
    public partial UserReadModel UsuarioModelToUserReadModel(UsuarioModel model);
    
    //TODO: REVIEW: Move para outro mapper?
    [MapProperty(nameof(RegisterUserRequestModel.username), nameof(UsuarioModel.nomeUsuario))]
    [MapProperty(nameof(RegisterUserRequestModel.email), nameof(UsuarioModel.emailUsuario))]
    [MapProperty(nameof(RegisterUserRequestModel.password), nameof(UsuarioModel.senhaUsuario))]
    [MapProperty(nameof(RegisterUserRequestModel.role), nameof(UsuarioModel.tipoUsuario))]
    [MapProperty(nameof(RegisterUserRequestModel.username), nameof(UsuarioModel.nomeUsuario))]
    public partial UsuarioModel RegisterUserRequestModelToUsuarioModel(RegisterUserRequestModel model);
}