using System.Net;
using System.Net.Mail;
using StudyLabAPI.Services.Email.Models;
using MailMessage = System.Net.Mail.MailMessage;

namespace StudyLabAPI.Services.Email;

public class EmailService : IDisposable
{
    private SmtpClient smtpClient { get; }
    private string serverEmail { get; }

    public EmailService(string smtpServer, int port, string email, string password)
    {
        smtpClient = new(smtpServer, port)
        {
            Credentials = new NetworkCredential(email, password),
            EnableSsl = true,
            UseDefaultCredentials = false
        };
        serverEmail = email;
    }
    
    public async Task SendEmail(EmailIntent intent)
    {
        MailMessage internalMailScope = new(from: serverEmail, to: intent.toEmail)
        {
            Subject = intent.subject,
            Body = intent.message,
        };;
        await smtpClient.SendMailAsync(internalMailScope);
        
        
    }

    public void Dispose()
    {
        smtpClient.Dispose();
        GC.SuppressFinalize(this);
    }
}