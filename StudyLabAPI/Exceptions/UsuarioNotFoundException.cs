namespace StudyLabAPI.Exceptions;

public class UsuarioNotFoundException : Exception
{
    private const string MESSAGE = "Email [{1}] não encontrado";

    public UsuarioNotFoundException(string parameterName, string parameterValue) : 
        base(string.Format(MESSAGE, parameterName, parameterValue)) { }
}