using StudyLabAPI.Services.Email.Models;

namespace StudyLabAPI.Services.Email;

public interface IEmailService
{
    public Task SendEmail(EmailIntent intent);
}