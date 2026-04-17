using System.Net;
using System.Net.Mail;
using System.Text;
using StudyLabAPI.Services.Email.Models;
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
    private readonly string _supaKey;
    private readonly bool _sendMailThroughSmtp;

    public EmailService(EnvironmentService environmentService)
    {
        _smtpServer = environmentService.smtpServer;
        _smtpPort = int.Parse(environmentService.smtpPort);
        _smtpEmail = environmentService.smtpEmail;
        _smtpPassword = environmentService.smtpPassword;
        _supaKey = environmentService.supabaseKey;
        _sendMailThroughSmtp = environmentService.sendMailThroughSmtp;
        
        smtpClient = new(_smtpServer, _smtpPort)
        {
            Credentials = new NetworkCredential(_smtpEmail, _smtpPassword),
            EnableSsl = true,
            UseDefaultCredentials = false,
        };
    }
    
    public async Task SendEmail(EmailIntent intent,bool useEdgeFunction = true)
    {
        string emailBody = intent.template.FormatWithParams();
        MailMessage internalMailScope = new(from: _smtpEmail, to: intent.toEmail)
        {
            Subject = intent.subject,
            Body = emailBody,
            IsBodyHtml = true,
        };
        
        if(_sendMailThroughSmtp)
            await smtpClient.SendMailAsync(internalMailScope);
        else
            await SendEmailViaSupabaseEdgeFunction(intent, emailBody);
    }
    
    private async Task SendEmailViaSupabaseEdgeFunction(EmailIntent intent, string emailBody)
    {
        var payload = new
        {
            to = intent.toEmail,
            subject = intent.subject,
            html = emailBody,
            text = "Feito de estudantes, para estudantes"
        };
    
        var json = System.Text.Json.JsonSerializer.Serialize(payload);
    
        using var httpClient = new HttpClient();
    
        httpClient.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue(
                "Bearer",
                _supaKey
            );
    
        using var content = new StringContent(json, Encoding.UTF8, "application/json");

        var url = "https://agqvmxhwxafycxcwhyft.supabase.co/functions/v1/send-email";
        
        var response = await httpClient.PostAsync(url, content);
    
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception(
                $"Erro ao enviar email via Supabase Edge Function: {response.StatusCode} - {error}"
            );
        }
    }


    public void Dispose()
    {
        smtpClient.Dispose();
        GC.SuppressFinalize(this);
    }
}