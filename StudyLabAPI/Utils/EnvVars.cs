namespace StudyLabAPI.Utils;

internal static class EnvVars
{
    //TODO: Move the API Key too
    public const string API_KEY = "API_KEY";
    public const string POSTGRES_CONNECTION_STRING = "POSTGRES_CONNECTION_STRING";
    public const string JWT_KEY = "JWT_KEY";
    public const string SMTP_SERVER = "SMTP_SERVER";
    public const string SMTP_PORT = "SMTP_PORT";
    public const string SMTP_EMAIL = "SMTP_EMAIL";
    public const string SMTP_PASSWORD = "SMTP_PASSWORD";
    public const string PASSWORD_SALT = "PASSWORD_SALT";
    
    public static string? GetApiKey() =>
        Environment.GetEnvironmentVariable(API_KEY);
    public static string? GetPostgresConnectionString() =>
        Environment.GetEnvironmentVariable(POSTGRES_CONNECTION_STRING);
    public static string? GetJwtKey() =>
        Environment.GetEnvironmentVariable(JWT_KEY);
    public static string? GetSmtpServer() =>
        Environment.GetEnvironmentVariable(SMTP_SERVER);
    public static string? GetSmtpPort() =>
        Environment.GetEnvironmentVariable(SMTP_PORT);
    public static string? GetSmtpEmail() =>
        Environment.GetEnvironmentVariable(SMTP_EMAIL);
    public static string? GetSmtpPassword() =>
        Environment.GetEnvironmentVariable(SMTP_PASSWORD);
    public static string? GetPasswordSalt() =>
        Environment.GetEnvironmentVariable(PASSWORD_SALT);
}