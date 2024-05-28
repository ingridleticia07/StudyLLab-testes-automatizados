namespace StudyLabAPI.Exceptions;

public class CursoNotFoundException : Exception
{
    private const string MESSAGE = "The Curso with ID[{0}] was not found.";
    
    public CursoNotFoundException(int id) : base(string.Format(MESSAGE, id))
    { }
}