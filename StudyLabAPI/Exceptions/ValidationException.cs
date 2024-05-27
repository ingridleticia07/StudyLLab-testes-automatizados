using StudyLabAPI.Utils.Extensions;

namespace StudyLabAPI.Exceptions;

public class ValidationException : Exception
{
    private const string MESSAGE = "Validation issues: {0}";

    public ValidationException(IEnumerable<string> errors) : 
        base(string.Format(MESSAGE, errors.ToSeparatedString())) { }
    public ValidationException(string error) : 
        base(string.Format(MESSAGE, error)) { }
}