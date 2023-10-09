using StudyLabAPI.Models;

namespace StudyLabAPI.Controllers;

public interface IAuthController
{
    public Task<UserReadModel> RegisterNewUser(RegisterUserRequestModel registerUserRequestModel);
}