namespace StudyLabAPI.Exceptions;

public class InvalidLoginPasswordException : Exception
{
    private const string MESSAGE = "Senha do usuário Email[{0}] inválida";

    public InvalidLoginPasswordException(string email) : 
        base(string.Format(MESSAGE, email)) { }
}