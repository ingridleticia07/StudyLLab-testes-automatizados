namespace StudyLabAPI.Services.Email.Models.Template;

public interface IEmailTemplate
{
    public string templateHtml { get; }
    public string FormatWithParams();
}