using StudyLabAPI.Services.Email.Models.Template;

namespace StudyLabAPI.Services.Email.Models;

public class EmailIntent
{
    public required string toEmail { get; init; }
    public required IEmailTemplate template { get; init; }
    public string? subject { get; init; }
}