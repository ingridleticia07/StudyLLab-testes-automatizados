using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Models;

namespace StudyLabAPI.Context;

public class AppDbContext : DbContext
{
    public DbSet<UsuarioModel> usuarios { get; set; } = null!;
    public DbSet<CursoModel> cursos { get; set; } = null!;
    
    public AppDbContext(DbContextOptions options) : base(options)
    { }
}