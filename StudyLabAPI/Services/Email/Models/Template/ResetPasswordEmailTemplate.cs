namespace StudyLabAPI.Services.Email.Models.Template;

public class ResetPasswordEmailTemplate : IEmailTemplate
{
    public required string username { get; init; }
    public required string resetPasswordCode { get; init; }
    
    public string FormatWithParams()
    {
      DotLiquid.Template template = DotLiquid.Template.Parse(templateHtml);
      string? emailBody = template.Render(DotLiquid.Hash.FromDictionary(new Dictionary<string, object>
      {
        { "username", username },
        { "code", resetPasswordCode }
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
                                    <body class="poppins-regular">
                                      <center class="wrapper">
                                        <table class="main">
                                          <tr>
                                            <td>
                                              <table>
                                                <tr>
                                                  <td>
                                                    <div>
                                                      <span id="study-logo">Study</span><span id="study-logo" class="urbanist-bold">Lab</span>
                                                    </div>
                                                  </td>
                                                </tr>
                                              </table>
                                              <table style="padding-bottom: 10px;">
                                                <tr>
                                                  <tr>
                                                    <td>
                                                      <small>Olá {username}, aqui está o seu código de redefinição de senha:</small>
                                                    </td>
                                                  </tr>
                                                </tr>
                                              </table>
                                              <table>
                                                <tr class="text-center">
                                                  <td>
                                                    <h2>{code}</h2>
                                                  </td>
                                                </tr>
                                              </table>
                                              <table>
                                                  <tr>
                                                    <td>
                                                      <small>
                                                          Se você não solicitou a redefinição de senha, ignore este email.
                                                      </small>
                                                    </td>
                                                  </tr>
                                                </table>
                                              <table style="padding-top: 25px">
                                                <tr class="text-center">
                                                  <td>
                                                    <small>
                                                      Todos os direitos reservados © LearningLab 2024
                                                    </small>
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                      </center>
                                    </body>
                                  </html>
                                  
                                  <style>
                                    @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@200;800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
                                    @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@200;800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap");
                                  
                                    :root {
                                      --font-study-color: #FF8700;
                                    }
                                  
                                    * {
                                      padding: 0;
                                      margin: 0;
                                    }
                                  
                                    body {
                                      background-color: var(--font-study-color);
                                    }
                                    table {
                                      border-spacing: 0;
                                      width: 100%;
                                    }
                                    h2 {
                                      text-align: center;
                                    }
                                  
                                    #study-logo {
                                      color: var(--font-study-color);
                                      font: urbanist-regular;
                                      font-size: 32px;
                                    }
                                    #wellcome-text {
                                      font-size: large;
                                      font-weight: bold;
                                    }
                                  
                                    .wrapper {
                                      width: 100%;
                                      table-layout: fixed;
                                      background-color: var(--font-study-color);
                                      padding-bottom: 60px;
                                    }
                                    .main {
                                      background-color: #ffffff;
                                      margin: 0 auto;
                                      width: 100%;
                                      max-width: 600px;
                                      padding: 10px;
                                    }
                                  
                                    .text-center {
                                      text-align: center;
                                    }
                                  
                                    .poppins-regular {
                                      font-family: "Poppins", sans-serif;
                                      font-weight: 400;
                                      font-style: normal;
                                    }
                                  
                                    .urbanist-regular {
                                      font-family: "Urbanist", sans-serif;
                                      font-optical-sizing: auto;
                                      font-weight: 400;
                                      font-style: normal;
                                    }
                                    .urbanist-bold {
                                      font-family: "Urbanist", sans-serif;
                                      font-optical-sizing: auto;
                                      font-weight: 700;
                                      font-style: normal;
                                    }
                                  </style>
                                  """;
}