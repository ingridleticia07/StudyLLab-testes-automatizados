using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Options;

namespace StudyLabAPI.Context;

public class AppDbContext : DbContext
{
    private readonly ConnectionStringsOptions _options;
    
    public DbSet<UsuarioModel> usuarios { get; set; } = null!;
    public DbSet<CursoModel> cursos { get; set; } = null!;
    public DbSet<CodigoUsuarioModel> codigoUsuario { get; set; } = null!;
    public DbSet<DisciplinaModel> disciplinas { get; set; } = null!;

    public DbSet<TopicoDiscussaoModel> discussao { get; set; } = null!;

    public DbSet<RespostaForumModel> respostaForum { get; set; } = null;

    public DbSet<ForumModel> forum { get; set; } = null;

    public AppDbContext(IOptions<ConnectionStringsOptions> options)
    {
        _options = options.Value;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
        optionsBuilder.UseNpgsql(_options.PostgresDbConnString);
}