using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Context;
using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories;

/// <summary>
/// Implementação genéricas do repositório <see cref="IUsuarioRepository"/>.
/// </summary>
public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _dbContext;
    private readonly IDbContextFactory<AppDbContext> _dbContextFactory;

    public UsuarioRepository(AppDbContext dbContext, IDbContextFactory<AppDbContext> dbContextFactory)
    {
        _dbContext = dbContext;
        _dbContextFactory = dbContextFactory;
    }

    public async Task<UsuarioModel?> GetUsuarioById(int id, bool onlyFindAsync)
    {
        UsuarioModel? usuarioModel = null;

        if(onlyFindAsync)
            usuarioModel = await _dbContext.usuarios.FindAsync(id);
        else
            usuarioModel = await _dbContext.usuarios.AsNoTracking().Include(m => m.curso).FirstOrDefaultAsync(m => m.idUsuario == id);

        if (usuarioModel is null) return null;

        return usuarioModel;
    }

    public async Task<UsuarioModel?> GetUsuarioByEmail(string email, bool isUserActive = false)
    {
        UsuarioModel? userModel = null;

        if (isUserActive)
        {
            userModel = await _dbContext.usuarios
            .FirstOrDefaultAsync(u => u.emailUsuario == email && u.statusUsuario == true);
        }
        else
        {
            userModel = await _dbContext.usuarios
            .FirstOrDefaultAsync(u => u.emailUsuario == email);
        }

        if (userModel is null) return null;

        await _dbContext.Entry(userModel).Reference(m => m.curso).LoadAsync();
        return userModel;
    }

    public Task<IList<UsuarioModel>> GetUsers(int page, int pageSize) =>
        GetUsers(_dbContext, page, pageSize);

    private async Task<IList<UsuarioModel>> GetUsersWFactory(int page, int pageSize)
    {
        await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

        if (inDbContext is null)
            throw new("Was not possible to instanciaite a new DbContext");

        return await GetUsers(inDbContext, page, pageSize);
    }

    private async Task<IList<UsuarioModel>> GetUsers(AppDbContext inDbContext, int page, int pageSize)
    {
        var result = await inDbContext.usuarios
            .AsNoTracking()
            .OrderBy(f => f.idUsuario)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(f => f.curso)
            .ToListAsync();

        return result;
    }

    public Task<int> GetUsersCount() =>
        GetUsersCount(_dbContext);

    private async Task<int> GetUsersCountWFactory()
    {
        await using AppDbContext? inDbContext = await _dbContextFactory.CreateDbContextAsync();

        if (inDbContext is null)
            throw new("Was not possible to instanciaite a new DbContext");

        return await GetUsersCount(inDbContext);
    }

    private async Task<int> GetUsersCount(AppDbContext inDbContext) =>
        await inDbContext.usuarios.CountAsync();

    public async Task<(IList<UsuarioModel>, int, int)> GetUsersAndCount(int page, int pageSize)
    {
        var usersTask = GetUsersWFactory(page, pageSize);
        var usersCountTask = GetUsersCountWFactory();
        await Task.WhenAll(usersTask, usersCountTask);

        var result = usersTask.Result;
        int usersCount = usersCountTask.Result;
        return (result, result.Count, usersCount);
    }

    public async Task<bool> CheckUserByMatriculaAndEmail(string matricula, string email)
    {
        bool exists = await _dbContext.usuarios
            .AnyAsync(u => u.matricula == matricula ||
                           u.emailUsuario == email);
        return exists;
    }

    public async Task CreateUser(UsuarioModel usuarioModel) =>
        await _dbContext.usuarios.AddAsync(usuarioModel);

    public void DeleteUser(UsuarioModel usuario) =>
        _dbContext.usuarios.Remove(usuario);

    public async Task FlushChanges() =>
        await _dbContext.SaveChangesAsync();
}