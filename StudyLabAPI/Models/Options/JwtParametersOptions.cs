namespace StudyLabAPI.Models.Options;

public class JwtParametersOptions
{
    public const string JWT_PARAMETERS = "JWTParameters";
    
    public string issuer { get; init; } = string.Empty;
    public string audience { get; init; } = string.Empty;
    public uint expirationTime { get; set; }
}