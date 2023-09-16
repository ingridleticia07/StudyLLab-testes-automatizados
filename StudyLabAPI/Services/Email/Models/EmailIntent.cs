using System.Net.Mail;

namespace StudyLabAPI.Services.Email.Models;

public class EmailIntent
{
    public required string toEmail { get; init; }
    public string? subject { get; init; }
    public string? message { get; init; }
}