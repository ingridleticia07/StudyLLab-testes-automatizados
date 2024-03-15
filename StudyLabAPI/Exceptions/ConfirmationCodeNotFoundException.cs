namespace StudyLabAPI.Exceptions;

public class ConfirmationCodeNotFoundException : Exception
{
    private const string MESSAGE = "Código de confirmação de email não encontrado para o usuário ID[{0}].";

    public ConfirmationCodeNotFoundException(int userId) : 
        base(string.Format(MESSAGE, userId)) { }
}