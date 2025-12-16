using StudyLabAPI.Utils.Extensions;

namespace StudyLabAPI.Exceptions;

public class ExistsUserException : Exception
{
    private const string MESSAGE = "Já existe um usuário com a mesma matrícula: [{0}] ou email: [{1}]";

    public ExistsUserException(string matricula, string email)
    : base(string.Format(MESSAGE, matricula, email)) { }

}