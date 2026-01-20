namespace StudyLabAPI.Services.Application.Utils;

public interface IUtilsService
{
    public bool ValidateAuthState(string? claimsFromContext);
}