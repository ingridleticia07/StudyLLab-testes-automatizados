namespace StudyLabAPI.Exceptions;

public class CursoNotFound : Exception
{
    private const string MESSAGE = "The Curso with ID[{0}] was not found.";
    
    public CursoNotFound(int id) : base(string.Format(MESSAGE, id))
    { }
}