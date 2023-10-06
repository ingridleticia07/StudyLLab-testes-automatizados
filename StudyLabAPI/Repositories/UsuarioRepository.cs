using StudyLabAPI.Context;
using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories;

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
}