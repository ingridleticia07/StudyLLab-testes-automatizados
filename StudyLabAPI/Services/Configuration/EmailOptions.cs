namespace StudyLabAPI.Services.Configuration;

public class EmailOptions
{
    public const string SERVER_EMAIL = "ServerEmail";

    public string smtpServer { get; set; }
    public int port { get; set; }
    public string email { get; set; }
    public string password { get; set; }
}