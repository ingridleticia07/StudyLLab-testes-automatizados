namespace StudyLabAPI.Exceptions;

public class UsuarioNotFoundException : Exception
{
    private const string MESSAGE = "Usuario com Email[{0}] não encontrado";

    public UsuarioNotFoundException(string email) : 
        base(string.Format(MESSAGE, email)) { }
}