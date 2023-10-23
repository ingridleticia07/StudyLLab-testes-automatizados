using StudyLabAPI.Utils.Extensions;

namespace StudyLabAPI.Exceptions;

public class ExistsUserException : Exception
{
    private const string MESSAGE = "There's already a user registered with the same: {0}";

    public ExistsUserException(IEnumerable<string> invalidFields) : 
        base(string.Format(MESSAGE, invalidFields.ToSeparatedString())) { }
}