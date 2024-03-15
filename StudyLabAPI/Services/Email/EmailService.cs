using System.Net;
using System.Net.Mail;
using StudyLabAPI.Exceptions;
using StudyLabAPI.Services.Email.Models;
using StudyLabAPI.Utils;
using MailMessage = System.Net.Mail.MailMessage;
// ReSharper disable PrivateFieldCanBeConvertedToLocalVariable

namespace StudyLabAPI.Services.Email;

public class EmailService : IDisposable, IEmailService
{
    private SmtpClient smtpClient { get; }
    private readonly string _smtpServer;
    private readonly int _smtpPort;
    private readonly string _smtpEmail;
    private readonly string _smtpPassword;

    public EmailService()
    {
        _smtpServer = EnvVars.GetSmtpServer() ?? 
                     throw new EnvironmentVariableIsNullOrEmptyException(nameof(EnvVars.SMTP_SERVER));
        _smtpPort = int.Parse(EnvVars.GetSmtpPort() ?? 
                         throw new EnvironmentVariableIsNullOrEmptyException(nameof(EnvVars.SMTP_PORT)));
        _smtpEmail = EnvVars.GetSmtpEmail() ??
                    throw new EnvironmentVariableIsNullOrEmptyException(nameof(EnvVars.SMTP_EMAIL));
        _smtpPassword = EnvVars.GetSmtpPassword() ??
                       throw new EnvironmentVariableIsNullOrEmptyException(nameof(EnvVars.SMTP_PASSWORD));
        
        smtpClient = new(_smtpServer, _smtpPort)
        {
            Credentials = new NetworkCredential(_smtpEmail, _smtpPassword),
            EnableSsl = true,
            UseDefaultCredentials = false,
        };
    }
    
    public async Task SendEmail(EmailIntent intent)
    {
        string emailBody = intent.template.FormatWithParams();
        MailMessage internalMailScope = new(from: _smtpEmail, to: intent.toEmail)
        {
            Subject = intent.subject,
            Body = emailBody,
            IsBodyHtml = true,
        };
        await smtpClient.SendMailAsync(internalMailScope);
    }

    public void Dispose()
    {
        smtpClient.Dispose();
        GC.SuppressFinalize(this);
    }
}