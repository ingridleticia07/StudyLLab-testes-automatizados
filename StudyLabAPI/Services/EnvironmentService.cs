namespace StudyLabAPI.Services;

public class EnvironmentService
{
    public required string apiKey { get; init; }
    public required string postgresConnectionString { get; init; }
    public required string jwtKey { get; init; }
    public required string smtpServer { get; init; }
    public required string smtpPort { get; init; }
    public required string smtpEmail { get; init; }
    public required string smtpPassword { get; init; }
    public required string passwordSalt { get; init; }
}