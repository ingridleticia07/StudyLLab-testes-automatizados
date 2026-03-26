using Riok.Mapperly.Abstractions;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Auth;
using StudyLabAPI.Models.User.DTOs;

namespace StudyLabAPI.Mapper;

[Mapper]
public partial class CodigoUsuarioModelMapper
{
    [MapProperty(nameof(CodigoUsuarioModel.codigo), nameof(CodigoUsuarioReadModel.code))]
    [MapProperty(nameof(CodigoUsuarioModel.tipo), nameof(CodigoUsuarioReadModel.codeKind))]
    public partial CodigoUsuarioReadModel CodigoUsuarioToCodigoUsuarioReadModel(CodigoUsuarioModel codigoUsuarioModel);
}