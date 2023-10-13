namespace StudyLabAPI.Models.Options;

public class JwtParametersOptions
{
    public const string JWT_PARAMETERS = "JWTParameters";

    public string privateKey { get; set; } = string.Empty;
    public string issuer { get; set; } = string.Empty;
    public string audience { get; set; } = string.Empty;
}