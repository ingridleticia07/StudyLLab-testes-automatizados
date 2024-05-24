using StudyLabAPI.Exceptions;
using StudyLabAPI.Mapper;
using StudyLabAPI.Models;
using StudyLabAPI.Repositories;
using StudyLabAPI.Validators.CustomValidators.RequestQuery;
using ILogger = Serilog.ILogger;

namespace StudyLabAPI.Controllers;

/// <summary>
/// Implementação genérica de <see cref="IUsuarioController"/>.
/// </summary>
public class UsuarioController : IUsuarioController
{
    private readonly IUsuarioRepository _userRepository;
    private readonly UsuarioModelMapper _usuarioModelMapper;
    private ILogger logger { get; }

    public UsuarioController(IUsuarioRepository userRepository, UsuarioModelMapper usuarioModelMapper, 
        ILogger logger)
    {
        _userRepository = userRepository;
        _usuarioModelMapper = usuarioModelMapper;
        this.logger = logger;
    }

    public async Task<IReadOnlyList<UserReadModel>> GetUsers(int page, int pageSize)
    {
        logger.Information("Validando parâmetros de paginação: Page[{Page}] PageSize[{PageSize}]",
            page, pageSize);
        PageValidator validator = new(page, pageSize);
        if (!validator.isValid)
        {
            ValidationException exception = new(new [] {"Parâmetros de paginação inválidos"});
            logger.Error(exception, "Parâmetros de paginação inválidos");
            throw exception;
        }
        
        logger.Information("Recuperando usuários da página Page[{Page}] PageSize[{PageSize}]",
            page, pageSize);

        var result = await _userRepository.GetUsers(page, pageSize);

        var userReadResult = result
            .Select(_usuarioModelMapper.UsuarioModelToUserReadModel)
            .ToList();
        
        logger.Information("Recuperado {Count} usuários da página Page[{Page}] PageSize[{PageSize}]",
            userReadResult.Count, page, pageSize);

        return userReadResult;
    }
    
    public async Task<UserReadModel> GetUserInfoById(int id)
    {
        logger.Information("Recuperando informações do usuário ID[{ID}]",
            id);
        UsuarioModel? user = await _userRepository.GetUsuarioById(id);
        if (user is null)
        {
            UsuarioNotFoundException usuarioNotFoundException = new(nameof(id), id.ToString());
            logger.Error(usuarioNotFoundException, "Usuario não encontrado");
            throw usuarioNotFoundException;
        }
        
        UserReadModel userRead = _usuarioModelMapper.UsuarioModelToUserReadModel(user);

        return userRead;
    }
}