using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Context;
using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories;

/// <summary>
/// Implementação genéricas do repositório <see cref="IUsuarioRepository"/>.
/// </summary>
public class UsuarioRepository : IUsuarioRepository
{
    private AppDbContext dbContext { get; }

    public UsuarioRepository(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }
    
    public async Task<UsuarioModel?> GetUsuarioById(int id)
    {
        UsuarioModel? userModel = await dbContext.usuarios
            .FindAsync(id);
        if (userModel is null) return null;
        
        await dbContext.Entry(userModel).Reference(m => m.curso).LoadAsync();
        return userModel;
    }

    public async Task<UsuarioModel?> GetUsuarioByEmail(string email)
    {
        UsuarioModel? userModel = await dbContext.usuarios
            .FirstOrDefaultAsync(u => u.emailUsuario == email);
        if(userModel is null) return null;
        
        await dbContext.Entry(userModel).Reference(m => m.curso).LoadAsync();
        return userModel;
    }

    public async Task<IList<UsuarioModel>> GetUsers(int page, int pageSize)
    {
        var result = await dbContext.usuarios
            .AsNoTracking()
            .OrderBy(f => f.idUsuario)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(f => f.curso)
            .ToListAsync();
        
        return result;
    }
    
    public async Task<bool> CheckUserByMatriculaAndEmail(string matricula, string email)
    {
        bool exists = await dbContext.usuarios
            .AnyAsync(u => u.matricula == matricula || 
                           u.emailUsuario == email);
        return exists;
    }

    public async Task CreateUser(UsuarioModel usuarioModel) =>
        await dbContext.usuarios.AddAsync(usuarioModel);

    public void DeleteUser(UsuarioModel usuario) =>
        dbContext.usuarios.Remove(usuario);
    
    public async Task FlushChanges() => 
        await dbContext.SaveChangesAsync();
}