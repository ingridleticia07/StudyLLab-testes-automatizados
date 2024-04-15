namespace StudyLabAPI.Controllers;

public interface IUtilsController
{
    public bool ValidateAuthState(string? claimsFromContext);
}