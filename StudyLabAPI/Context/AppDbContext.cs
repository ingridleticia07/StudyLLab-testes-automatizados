using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Auth;
using StudyLabAPI.Models.Curso;
using StudyLabAPI.Models.Disciplina;
using StudyLabAPI.Models.Forum;
using StudyLabAPI.Models.Material;
using StudyLabAPI.Models.User;
using StudyLabAPI.Services;
// ReSharper disable PropertyCanBeMadeInitOnly.Global

namespace StudyLabAPI.Context;

/// <summary>
/// DbContext da aplicação, responsável por mapear as entidades do banco de dados.
/// </summary>
public class AppDbContext : DbContext
{
    private string connectionString { get; }
    
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

    public DbSet<DenunciaModel> denuncia { get; set; } = null!;

    public AppDbContext(EnvironmentService environmentService)
    {
        connectionString = environmentService.postgresConnectionString;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
        optionsBuilder.UseNpgsql(connectionString);
}