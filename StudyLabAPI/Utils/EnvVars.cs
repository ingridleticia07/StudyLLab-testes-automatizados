using StudyLabAPI.Services;

namespace StudyLabAPI.Utils;

internal static class EnvVars
{
    //TODO: Move the API Key too
    private const string API_KEY = "API_KEY";
    private const string POSTGRES_CONNECTION_STRING = "POSTGRES_CONNECTION_STRING";
    private const string JWT_KEY = "JWT_KEY";
    private const string SMTP_SERVER = "SMTP_SERVER";
    private const string SMTP_PORT = "SMTP_PORT";
    private const string SMTP_EMAIL = "SMTP_EMAIL";
    private const string SMTP_PASSWORD = "SMTP_PASSWORD";
    private const string PASSWORD_SALT = "PASSWORD_SALT";
    private const string SUPABASE_URL = "SUPA_URL";
    private const string SUPABASE_KEY = "SUPA_KEY";
    private const string SEND_MAIL_THROUGH_SMTP = "SEND_MAIL_THROUGH_SMTP";
        
    public static string? GetApiKey() =>
        Environment.GetEnvironmentVariable(API_KEY);
    private static string? GetPostgresConnectionString() =>
        Environment.GetEnvironmentVariable(POSTGRES_CONNECTION_STRING);
    private static string? GetJwtKey() =>
        Environment.GetEnvironmentVariable(JWT_KEY);
    private static string? GetSmtpServer() =>
        Environment.GetEnvironmentVariable(SMTP_SERVER);
    private static string? GetSmtpPort() =>
        Environment.GetEnvironmentVariable(SMTP_PORT);
    private static string? GetSmtpEmail() =>
        Environment.GetEnvironmentVariable(SMTP_EMAIL);
    private static string? GetSmtpPassword() =>
        Environment.GetEnvironmentVariable(SMTP_PASSWORD);
    private static string? GetPasswordSalt() =>
        Environment.GetEnvironmentVariable(PASSWORD_SALT);
    
    public static string? GetSupabaseUrl() =>
        Environment.GetEnvironmentVariable(SUPABASE_URL);
    
    public static string? GetSupabaseKey() =>
            Environment.GetEnvironmentVariable(SUPABASE_KEY);
    
    public static bool? GetSendMailThroughSmtp()
    {
        var value = Environment.GetEnvironmentVariable(SEND_MAIL_THROUGH_SMTP);

        if (bool.TryParse(value, out var result))
            return result;

        return false;
    }

    public static EnvironmentService CreateEnvironmentServiceFromVariables() =>
        new()
        {
            apiKey = GetApiKey() ?? throw new ArgumentNullException(API_KEY),
            postgresConnectionString = GetPostgresConnectionString() ?? throw new ArgumentNullException(POSTGRES_CONNECTION_STRING),
            jwtKey = GetJwtKey() ?? throw new ArgumentNullException(JWT_KEY),
            smtpServer = GetSmtpServer() ?? throw new ArgumentNullException(SMTP_SERVER),
            smtpPort = GetSmtpPort() ?? throw new ArgumentNullException(SMTP_PORT),
            smtpEmail = GetSmtpEmail() ?? throw new ArgumentNullException(SMTP_EMAIL),
            smtpPassword = GetSmtpPassword() ?? throw new ArgumentNullException(SMTP_PASSWORD),
            passwordSalt = GetPasswordSalt() ?? throw new ArgumentNullException(PASSWORD_SALT),
            supabaseUrl = GetSupabaseUrl() ?? throw new ArgumentNullException(SUPABASE_URL),
            supabaseKey = GetSupabaseKey() ?? throw new ArgumentNullException(SUPABASE_KEY),
            sendMailThroughSmtp = GetSendMailThroughSmtp() ?? throw new ArgumentNullException(SEND_MAIL_THROUGH_SMTP)
        };
}