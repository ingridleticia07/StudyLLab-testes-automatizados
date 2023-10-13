using StudyLabAPI.Models;

namespace StudyLabAPI.Controllers;

public interface IAuthController
{
    public Task<(UserReadModel, string)> RegisterNewUser(RegisterUserRequestModel registerUserRequestModel);
    public Task<(UserReadModel, string)> LoginUser(UserLoginRequestModel userLoginRequestModel);
}