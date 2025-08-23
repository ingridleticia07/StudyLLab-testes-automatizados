using FluentValidation;
using FluentValidation.Results;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Mapper;
using StudyLabAPI.Models;
using StudyLabAPI.Repositories;
using StudyLabAPI.Services.Hash;
using StudyLabAPI.Validators.CustomValidators;
using StudyLabAPI.Validators.CustomValidators.RequestQuery;
using ILogger = Serilog.ILogger;
using ValidationException = StudyLabAPI.Exceptions.ValidationException;

namespace StudyLabAPI.Controllers;

/// <summary>
/// Implementação genérica de <see cref="IUsuarioController"/>.
/// </summary>
public class UsuarioController : IUsuarioController
{
    private readonly IUsuarioRepository _userRepository;
    private readonly ICursoRepository _cursoRepository;
    private readonly ICodigoUsuarioRepository _codigoUsuarioRepository;
    private readonly UsuarioModelMapper _usuarioModelMapper;
    private readonly IValidator<UpdateUserRequestModel> _updateUserValidator;
    private ILogger logger { get; }
    private IHashService hashService { get; }
    public UsuarioController(IUsuarioRepository userRepository, UsuarioModelMapper usuarioModelMapper,
        ICursoRepository cursoRepository, ICodigoUsuarioRepository codigoUsuarioRepository,
        IValidator<UpdateUserRequestModel> updateUserValidator, ILogger logger, IHashService hashService)
    {
        _userRepository = userRepository;
        _cursoRepository = cursoRepository;
        _codigoUsuarioRepository = codigoUsuarioRepository;
        _usuarioModelMapper = usuarioModelMapper;
        _updateUserValidator = updateUserValidator;
        this.logger = logger;
        this.hashService = hashService;
    }

    public async Task<UsersListResponse> GetUsers(int page, int pageSize, bool onlyProfessor = false)
    {
        logger.Information("Validando parâmetros de paginação: Page[{Page}] PageSize[{PageSize}]",
            page, pageSize);
        PageValidator validator = new(page, pageSize);
        if (!validator.isValid)
        {
            ValidationException exception = new(["Parâmetros de paginação inválidos"]);
            logger.Error(exception, "Parâmetros de paginação inválidos");
            throw exception;
        }
        
        logger.Information("Recuperando usuários da página Page[{Page}] PageSize[{PageSize}]",
            page, pageSize);

        (var result, int resultCount, int usersCount) = await _userRepository
            .GetUsersAndCount(page, pageSize, onlyProfessor);

        var userReadResult = result
            .Select(_usuarioModelMapper.UsuarioModelToUserReadModel)
            .ToList();
        
        logger.Information("Recuperado {Count} usuários da página Page[{Page}] PageSize[{PageSize}]",
            userReadResult.Count, page, pageSize);
        logger.Information("Recuperando informações extras para a resposta");
        
        int maxPage = usersCount / pageSize;
        if (usersCount % pageSize != 0)
            maxPage++;

        return new()
        {
            maxPage = maxPage,
            usersCount = usersCount,
            pageCount = resultCount,
            users = userReadResult
        };
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
    
    public async Task<UserReadModel> UpdateUserById(int userId, UpdateUserRequestModel request)
    {
        logger.Information("Validando ID do usuário: ID[{ID}]", userId);
        UserIdValidator validator = new(userId);
        if (!validator.isValid)
        {
            ValidationException exception = new("O ID do usuário é inválido");
            logger.Error(exception, "ID do usuário inválido");
            throw exception;
        }
        
        logger.Information("Velidando compos da requisição de atualização do usuário: ID[{ID}]", userId);
        ValidationResult result = await _updateUserValidator.ValidateAsync(request);
        if (!result.IsValid)
        {
            ValidationException exception = new(result.Errors.Select(e => e.ErrorMessage));
            logger.Error(exception, "Requisição de atualização do usuário inválida");
            throw exception;
        }
        
        logger.Information("Recuperando usuário com ID[{ID}]", userId);
        UsuarioModel? user = await _userRepository.GetUsuarioById(userId, true);
        if (user is null)
        {
            UsuarioNotFoundException usuarioNotFoundException = new(nameof(userId), userId.ToString());
            logger.Error(usuarioNotFoundException, "Usuário não encontrado");
            throw usuarioNotFoundException;
        }
        
        logger.Information("Atualizando informações do usuário ID[{ID}]", userId);
        bool hasUpdatedSomeField = await UpdateUserFields(user, request);
        if (hasUpdatedSomeField)
            await _userRepository.FlushChanges();
        else logger.Warning("Nenhuma informação foi atualizada para o usuário ID[{ID}]", userId);
        
        logger.Information("Usuário ID[{ID}] atualizado", userId);
        user.curso = new CursoModel();
        UserReadModel userRead = _usuarioModelMapper.UsuarioModelToUserReadModel(user);
        return userRead;
    }

    public async Task<int> DeleteUser(int userId)
    {
        UserIdValidator validator = new(userId);
        if (!validator.isValid)
        {
            ValidationException exception = new("O ID do usuário é inválido");
            logger.Error(exception, "ID do usuário inválido");
            throw exception;
        }
        
        logger.Information("Recuperando usuário com ID[{ID}]", userId);
        UsuarioModel? user = await _userRepository.GetUsuarioById(userId, true);
        if (user is null)
        {
            UsuarioNotFoundException usuarioNotFoundException = new(nameof(userId), userId.ToString());
            logger.Error(usuarioNotFoundException, "Usuário não encontrado");
            throw usuarioNotFoundException;
        }
        
        await _codigoUsuarioRepository.DeleteAllUsersCodes(user);
        _userRepository.DeleteUser(user);
        await _userRepository.FlushChanges();
        
        logger.Information("Usuário ID[{ID}] deletado", userId);
        return userId;
    }
    
    private async Task<bool> UpdateUserFields(UsuarioModel user, UpdateUserRequestModel request)
    {
        bool updated = false;

        if (request.username is not null)
        {
            user.nomeUsuario = request.username;
            updated = true;
        }

        if (request.password is not null)
        {
            user.senhaUsuario = hashService.Hash(request.password);
            updated = true;
        }

        if (request.role is not null || request.role.HasValue)
        {
            user.tipoUsuario = request.role.Value;
            updated = true;
        }

        if (request.active is not null || request.active.HasValue)
        {
            user.statusUsuario = request.active.Value;
            updated = true;
        }

        if (request.codeCurso is not null || request.codeCurso.HasValue)
        {
            CursoModel? curso = await _cursoRepository.GetCursoById(request.codeCurso.Value);

            if (curso is null)
            {
                CursoNotFoundException cursoNotFoundExceptionException = new(request.codeCurso.Value);
                logger.Error(cursoNotFoundExceptionException, "Curso não encontrado");
                throw cursoNotFoundExceptionException;
            }
            
            user.curso = curso;
            updated = true;
        }

        if (request.imagem is not null)
        {
            user.imagemUsuario = request.imagem;
            updated = true;
        }

        return updated;
    }
}