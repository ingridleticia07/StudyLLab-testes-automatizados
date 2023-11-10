using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using StudyLabAPI.Models.Options;
using StudyLabAPI.Services.Email.Models;
using MailMessage = System.Net.Mail.MailMessage;

namespace StudyLabAPI.Services.Email;

public class EmailService : IDisposable, IEmailService
{
    private SmtpClient smtpClient { get; }
    // ReSharper disable once UnusedAutoPropertyAccessor.Local
    private readonly EmailOptions options;
    private string serverEmail { get; }

    public EmailService(IOptions<EmailOptions> emailOptions)
    {
        options = emailOptions.Value;
        smtpClient = new(options.smtpServer, options.port)
        {
            Credentials = new NetworkCredential(options.email, options.password),
            EnableSsl = true,
            UseDefaultCredentials = false
        };
        serverEmail = options.email;
    }
    
    public async Task SendEmail(EmailIntent intent)
    {
        MailMessage internalMailScope = new(from: serverEmail, to: intent.toEmail)
        {
            Subject = intent.subject,
            Body = intent.message,
        };
        await smtpClient.SendMailAsync(internalMailScope);
    }

    public void Dispose()
    {
        smtpClient.Dispose();
        GC.SuppressFinalize(this);
    }
}