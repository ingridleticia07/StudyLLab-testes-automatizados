using Riok.Mapperly.Abstractions;
using StudyLabAPI.Models;
using StudyLabAPI.Models.User;
using StudyLabAPI.Models.User.DTOs;

namespace StudyLabAPI.Mapper;

[Mapper]
public partial class RegisterUserRequestModelMapper
{
    [MapProperty(nameof(RegisterUserRequestModel.username), nameof(UsuarioModel.nomeUsuario))]
    [MapProperty(nameof(RegisterUserRequestModel.email), nameof(UsuarioModel.emailUsuario))]
    [MapProperty(nameof(RegisterUserRequestModel.password), nameof(UsuarioModel.senhaUsuario))]
    [MapProperty(nameof(RegisterUserRequestModel.role), nameof(UsuarioModel.tipoUsuario))]
    [MapProperty(nameof(RegisterUserRequestModel.username), nameof(UsuarioModel.nomeUsuario))]
    public partial UsuarioModel RegisterUserRequestModelToUsuarioModel(RegisterUserRequestModel model);
}