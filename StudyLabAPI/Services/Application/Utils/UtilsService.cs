namespace StudyLabAPI.Services.Application.Utils;

public class UtilsService : IUtilsService
{
    public bool ValidateAuthState(string? claimsFromContext)
    {
        if(claimsFromContext is null)
            return false;
        
        bool canParse = int.TryParse(claimsFromContext, out int _);
        if(!canParse)
            return false;

        return true;
    }
}