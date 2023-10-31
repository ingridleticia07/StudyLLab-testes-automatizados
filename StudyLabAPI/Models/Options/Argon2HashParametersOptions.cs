namespace StudyLabAPI.Models.Options;

public class Argon2HashParametersOptions
{
    public const string HASH_PARAMETERS = "HashParameters";
    
    public int DegreeOfParallelism { get; set; }
    public int MemorySize { get; set; }
    public int Iterations { get; set; }
    public string Salt { get; set; } = string.Empty;
}