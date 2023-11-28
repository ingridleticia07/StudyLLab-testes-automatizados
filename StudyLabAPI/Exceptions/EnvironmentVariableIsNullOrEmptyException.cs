namespace StudyLabAPI.Exceptions;

public class EnvironmentVariableIsNullOrEmptyException : Exception
{
    public const string MESSAGE = "Environment variable {0} is null or empty and it is required.";
    
    public EnvironmentVariableIsNullOrEmptyException(string? envVarName) : 
        base(string.Format(MESSAGE, envVarName)) { }
}