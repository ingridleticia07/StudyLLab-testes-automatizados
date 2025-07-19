namespace StudyLabAPI.Exceptions;

public class ResetPasswordCodeNotFoundException : Exception
{
    private const string MESSAGE = "Código de recuperação de senha não foi encontrado para o usuário de Email [{0}].";

    public ResetPasswordCodeNotFoundException(string userEmail) : 
        base(string.Format(MESSAGE, userEmail)) { }
}