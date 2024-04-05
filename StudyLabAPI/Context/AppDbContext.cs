using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Models;
using StudyLabAPI.Utils;
// ReSharper disable PropertyCanBeMadeInitOnly.Global

namespace StudyLabAPI.Context;

/// <summary>
/// DbContext da aplicação, responsável por mapear as entidades do banco de dados.
/// </summary>
public class AppDbContext : DbContext
{
    private readonly string _connectionString = EnvVars.GetPostgresConnectionString() ?? 
                                                throw new EnvironmentVariableIsNullOrEmptyException(
                                                    nameof(EnvVars.POSTGRES_CONNECTION_STRING));
    
    /// <summary>
    /// Tabela de usuários. <see cref="UsuarioModel"/>
    /// </summary>
    public DbSet<UsuarioModel> usuarios { get; set; } = null!;
    
    /// <summary>
    /// Tabela de cursos. <see cref="CursoModel"/>
    /// </summary>
    public DbSet<CursoModel> cursos { get; set; } = null!;
    
    /// <summary>
    /// Tabela de códigos de confirmação de email e recuperação de senha. <see cref="CodigoUsuarioModel"/>
    /// </summary>
    public DbSet<CodigoUsuarioModel> codigoUsuario { get; set; } = null!;
    
    /// <summary>
    /// Tabela de disciplinas. <see cref="DisciplinaModel"/>
    /// </summary>
    public DbSet<DisciplinaModel> disciplinas { get; set; } = null!;
    
    /// <summary>
    /// Tabela de discussões. <see cref="TopicoDiscussaoModel"/>
    /// </summary>
    public DbSet<TopicoDiscussaoModel> discussao { get; set; } = null!;
    
    /// <summary>
    /// Tabela de respostas de discussões. <see cref="RespostaForumModel"/>
    /// </summary>
    public DbSet<RespostaForumModel> respostaForum { get; set; } = null!;
    
    /// <summary>
    /// Tabela de fóruns. <see cref="ForumModel"/>
    /// </summary>
    public DbSet<ForumModel> forum { get; set; } = null!;
    
    /// <summary>
    /// Tabela de documentos enviados pelas respostas (apenas metadata). <see cref="DocumentoModel"/> 
    /// </summary>
    public DbSet<DocumentoModel> documento { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
        optionsBuilder.UseNpgsql(_connectionString);
}