namespace StudyLabAPI.Exceptions;

public class CursoNotFoundException : Exception
{
    private const string MESSAGE = "O curso com ID[{0}] não foi encontrado.";
    
    public CursoNotFoundException(int id) : base(string.Format(MESSAGE, id))
    { }
}