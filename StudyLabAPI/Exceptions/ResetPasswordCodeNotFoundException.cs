namespace StudyLabAPI.Exceptions;

public class ResetPasswordCodeNotFoundException : Exception
{
    private const string MESSAGE = "Código de recuperação de senha não foi encontrado para o usuário ID[{0}].";

    public ResetPasswordCodeNotFoundException(int userId) : 
        base(string.Format(MESSAGE, userId)) { }
}