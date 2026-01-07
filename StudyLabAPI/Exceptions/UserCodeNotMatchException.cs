using StudyLabAPI.Models.Auth.Enums;

namespace StudyLabAPI.Exceptions;

public class UserCodeNotMatchException : Exception
{
    private const string MESSAGE = "Código informado Code[{0}] não corresponde ao código válido enviado para seu email.";

    public UserCodeNotMatchException(string code, UserCodeKind codeKind) : 
        base(string.Format(MESSAGE, code, codeKind.ToString())) { }
}