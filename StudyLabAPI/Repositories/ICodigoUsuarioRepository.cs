using StudyLabAPI.Models;
using StudyLabAPI.Models.Enums;

namespace StudyLabAPI.Repositories;

public interface ICodigoUsuarioRepository
{
    public Task<CodigoUsuarioModel?> GetUserCode(UsuarioModel usuarioModel, UserCodeKind codeKind);
    public CodigoUsuarioModel UseCode(UsuarioModel usuarioModel, CodigoUsuarioModel codigoUsuarioModel);
    public Task<CodigoUsuarioModel> GenerateAndEnsureCode(UsuarioModel usuarioModel, UserCodeKind codeKind);
    public Task Flush();
}