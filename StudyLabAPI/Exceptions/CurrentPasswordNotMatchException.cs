namespace StudyLabAPI.Exceptions;

public class CurrentPasswordNotMatchException : Exception
{
    private const string MESSAGE = "A senha atual CurrentPassword[{0}] não corresponde à senha do usuário.";

    public CurrentPasswordNotMatchException(string currentPassword) : 
        base(string.Format(MESSAGE, currentPassword)) { }
}