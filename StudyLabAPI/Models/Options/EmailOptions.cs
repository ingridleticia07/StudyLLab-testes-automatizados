namespace StudyLabAPI.Models.Options;

public class EmailOptions
{
    public const string SERVER_EMAIL = "ServerEmail";

    public string smtpServer { get; set; } = string.Empty;
    public int port { get; set; }
    public string email { get; set; } = string.Empty;
    public string password { get; set; } = string.Empty;
}