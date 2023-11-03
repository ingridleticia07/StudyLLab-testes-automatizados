using StudyLabAPI.Models.Enums;

namespace StudyLabAPI.Exceptions;

public class UserCodeNotMatchException : Exception
{
    private const string MESSAGE = "Código informado Code[{0}] não corresponde ao código válido. Tipo[{1}]";

    public UserCodeNotMatchException(string code, UserCodeKind codeKind) : 
        base(string.Format(MESSAGE, code, codeKind.ToString())) { }
}