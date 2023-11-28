using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Options;
using StudyLabAPI.Utils;

namespace StudyLabAPI.Context;

public class AppDbContext : DbContext
{
    private readonly string _connectionString = EnvVars.GetPostgresConnectionString() ?? 
                                                throw new EnvironmentVariableIsNullOrEmptyException(
                                                    nameof(EnvVars.POSTGRES_CONNECTION_STRING));
    
    public DbSet<UsuarioModel> usuarios { get; set; } = null!;
    public DbSet<CursoModel> cursos { get; set; } = null!;
    public DbSet<CodigoUsuarioModel> codigoUsuario { get; set; } = null!;
    public DbSet<DisciplinaModel> disciplinas { get; set; } = null!;

    public DbSet<TopicoDiscussaoModel> discussao { get; set; } = null!;

    public DbSet<RespostaForumModel> respostaForum { get; set; } = null!;

    public DbSet<ForumModel> forum { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
        optionsBuilder.UseNpgsql(_connectionString);
}