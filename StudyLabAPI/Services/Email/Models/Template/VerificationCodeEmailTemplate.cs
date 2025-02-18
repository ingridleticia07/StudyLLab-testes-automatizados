namespace StudyLabAPI.Services.Email.Models.Template;

public class VerificationCodeEmailTemplate : IEmailTemplate
{
    public required string username { get; init; }
    public required string verificationCode { get; init; }

    public string FormatWithParams()
    {
        DotLiquid.Template template = DotLiquid.Template.Parse(templateHtml);
        string? emailBody = template.Render(DotLiquid.Hash.FromDictionary(new Dictionary<string, object>
        {
            { "username", username },
            { "code", verificationCode }
        }));

        return emailBody;
    }

    public string templateHtml => """
    <!DOCTYPE html>
    <html lang="pt">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Template email</title>
      </head>
      <body style="font-family: 'Poppins', Arial, sans-serif; font-weight: 400; font-style: normal; background-color: #FF8700; margin: 0; padding: 0;">
        <center style="width: 100%; table-layout: fixed; background-color: #FF8700; padding: 20px 0;">
          <table style="background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; padding: 20px; border-spacing: 0; border-radius: 8px;">
            <tr>
              <td style="text-align: center; padding-bottom: 10px;">
                <div style="font-family: 'Urbanist', Arial, sans-serif; font-weight: 400; font-size: 32px; color: #FF8700;">
                  <span id="study-logo">StudyLab</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; font-size: 18px; font-weight: bold; padding-bottom: 10px;">
                Bem-vindo(a) {{ username }} 🎉, sua jornada começa aqui.
              </td>
            </tr>
            <tr>
              <td style="text-align: center; font-size: 14px; color: #555;">
                Verifique seu email para confirmar sua conta e começar a aprender.
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding-top: 20px;">
                <h3 style="margin: 0; color: #FF8700;">Código de verificação</h3>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding: 10px 0;">
                <h2 style="margin: 0; font-size: 24px; color: #000;">{{ code }}</h2>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding-top: 20px;">
                <small style="color: #888;">Todos os direitos reservados © LearningLab 2025</small>
              </td>
            </tr>
          </table>
        </center>
      </body>
    </html>
    """;
}