using StudyLabAPI.Services;

namespace StudyLabAPI.Test.ControllersTests.UtilsControllerTests;

public static class UtilsControllerFakeData
{
    public static EnvironmentService fakeEnvironmentService => new()
    {
        apiKey = "apiKey",
        jwtKey = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
        passwordSalt = "salt",
        smtpEmail = string.Empty,
        smtpPassword = string.Empty,
        smtpPort = string.Empty,
        postgresConnectionString = string.Empty,
        smtpServer = string.Empty,
        supabaseUrl = string.Empty,
        supabaseKey = string.Empty,
        sendMailThroughSmtp = true
    };
}