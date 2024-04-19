using FluentValidation;
using FluentValidation.Results;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Enums;
using StudyLabAPI.Validators;

namespace StudyLabAPI.Test.ControllersTests.AuthControllerTests;

public class AuthControllerValidationTest
{
    private readonly IValidator<RegisterUserRequestModel> _registerUserRequestModelValidator = new RegisterUserRequestModelValidator();
    private readonly IValidator<UserLoginRequestModel> _userLoginRequestModelValidator = new UserLoginRequestModelValidator();
    private readonly IValidator<ConfirmUserEmailRequestModel> _confirmUserEmailRequestModelValidator = new ConfirmUserEmailRequestModelValidator();
    private readonly IValidator<ResetUserPasswordRequestModel> _resetUserPasswordRequestModelValidator = new ResetUserPasswordRequestModelValidator();
    
    [Theory]
    [MemberData(nameof(InvalidRegisterUserRequestModelsParameters))]
    public void RegisterUserRequestModelValidatorInvalidModelTest(RegisterUserRequestModel model)
    {
        ValidationResult result = _registerUserRequestModelValidator.Validate(model);
        
        Assert.False(result.IsValid);
    }
    
    [Theory]
    [MemberData(nameof(ValidRegisterUserRequestModelParameters))]
    public void RegisterUserRequestModelValidtorValidModelTest(RegisterUserRequestModel model)
    {
        ValidationResult result = _registerUserRequestModelValidator.Validate(model);
        
        Assert.True(result.IsValid);
    }
    
    public static IEnumerable<object[]> InvalidRegisterUserRequestModelsParameters()
    {
        foreach (RegisterUserRequestModel registerUserRequestModel in GetInvalidRegisterUserRequest())
            yield return new object[] { registerUserRequestModel };
    }
    
    public static IEnumerable<object[]> ValidRegisterUserRequestModelParameters()
    {
        foreach (RegisterUserRequestModel registerUserRequestModel in GetValidRegisterUserRequest())
            yield return new object[] { registerUserRequestModel };
    }

    private static IEnumerable<RegisterUserRequestModel> GetInvalidRegisterUserRequest()
    {
        return new[]
        {
            new RegisterUserRequestModel
            {
                email = "",
                username = "test",
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456",
            },
            new RegisterUserRequestModel
            {
                email = "test",
                username = "test",
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456",
            },
            new RegisterUserRequestModel
            {
                email = "test@",
                username = "test",
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456",
            },
            new RegisterUserRequestModel
            {
                email = "test@test",
                username = "test",
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456",
            },
            new RegisterUserRequestModel
            {
                email = "test@.com",
                username = "test",
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456",
            },
            new RegisterUserRequestModel
            {
                email = "test@test.com",
                username = "",
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456",
            },
            new RegisterUserRequestModel
            {
                email = "test@test.com",
                username = new('a', 46),
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456",
            },
            new RegisterUserRequestModel
            {
                email = "test@test.com",
                username = "test",
                password = "",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456",
            },
            new RegisterUserRequestModel
            {
                email = "test@test.com",
                username = "test",
                password = new('a', 21),
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456",
            },
            new RegisterUserRequestModel
            {
                email = "test@test.com",
                username = "test",
                password = new('a', 1),
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456",
            },
            new RegisterUserRequestModel
            {
                email = "test@test.com",
                username = "test",
                password = new('a', 7),
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456",
            },
            new RegisterUserRequestModel
            {
                email = "test@test.com",
                username = "test",
                password = "test1234",
                codeCurso = -1,
                role = UserRole.User,
                matricula = "123456",
            },
            new RegisterUserRequestModel
            {
                email = "test@test.com",
                username = "test",
                password = "test1234",
                codeCurso = 0,
                role = UserRole.User,
                matricula = "123456",
            },
            new RegisterUserRequestModel
            {
                email = "test@test.com",
                username = "test",
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "",
            },
            new RegisterUserRequestModel
            {
                email = "test@test.com",
                username = "test",
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "0",
            },
            new RegisterUserRequestModel
            {
                email = "test@test.com",
                username = "test",
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "1",
            },
            new RegisterUserRequestModel
            {
                email = "test@test.com",
                username = "test",
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "12345",
            },
            new RegisterUserRequestModel
            {
                email = "test@test.com",
                username = "test",
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "1234567",
            },
            new RegisterUserRequestModel
            {
                username = "test",
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456"
            },
            new RegisterUserRequestModel
            {
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456"
            },
            new RegisterUserRequestModel
            {
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456"
            },
            new RegisterUserRequestModel
            {
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456"
            },
            new RegisterUserRequestModel
            {
                role = UserRole.User,
                matricula = "123456"
            },
            new RegisterUserRequestModel
            {
                matricula = "123456"
            },
            new RegisterUserRequestModel(),
        };
    }
    private static IEnumerable<RegisterUserRequestModel> GetValidRegisterUserRequest()
    {
        return new[]
        {
            new RegisterUserRequestModel
            {
                email = "test@alu.ufc.br",
                username = "test",
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456"
            },
            new RegisterUserRequestModel
            {
                email = "test@ufc.br",
                username = "test",
                password = "test1234",
                codeCurso = 1,
                role = UserRole.User,
                matricula = "123456"
            }
        };
    }
    
    [Theory]
    [MemberData(nameof(InvalidUserLoginRequestModelsParameters))]
    public void UserLoginRequestModelValidatorTest(UserLoginRequestModel model)
    {
        ValidationResult result = _userLoginRequestModelValidator.Validate(model);
        
        Assert.False(result.IsValid);
    }
    
    public static IEnumerable<object[]> InvalidUserLoginRequestModelsParameters()
    {
        foreach (UserLoginRequestModel userLoginRequestModel in GetInvalidValidUserLoginRequestRequest())
            yield return new object[] { userLoginRequestModel };
    }

    private static IEnumerable<UserLoginRequestModel> GetInvalidValidUserLoginRequestRequest()
    {
        return new[]
        {
            new UserLoginRequestModel
            {
                email = "",
                password = "test"
            },
            new UserLoginRequestModel
            {
                email = "test",
                password = ""
            },
            new UserLoginRequestModel
            {
                email = "",
                password = ""
            },
            new UserLoginRequestModel
            {
                password = ""
            },
            new UserLoginRequestModel()
        };
    }
    
    [Theory]
    [MemberData(nameof(InvalidConfirmUserEmailRequestModelsParameters))]
    public void ConfirmUserEmailRequestModelValidatorTest(ConfirmUserEmailRequestModel model)
    {
        ValidationResult result = _confirmUserEmailRequestModelValidator.Validate(model);
        
        Assert.False(result.IsValid);
    }
    
    public static IEnumerable<object[]> InvalidConfirmUserEmailRequestModelsParameters()
    {
        foreach (ConfirmUserEmailRequestModel confirmUserEmailRequestModel in GetInvalidConfirmUserEmailRequest())
            yield return new object[] { confirmUserEmailRequestModel };
    }
    
    private static IEnumerable<ConfirmUserEmailRequestModel> GetInvalidConfirmUserEmailRequest()
    {
        return new[]
        {
            new ConfirmUserEmailRequestModel
            {
                confirmationCode = ""
            },
            new ConfirmUserEmailRequestModel()
        };
    }
    
    [Theory]
    [MemberData(nameof(InvalidResetUserPasswordRequestModelsParameters))]
    public void ResetUserPasswordRequestModelValidatorTest(ResetUserPasswordRequestModel model)
    {
        ValidationResult result = _resetUserPasswordRequestModelValidator.Validate(model);
        
        Assert.False(result.IsValid);
    }
    
    public static IEnumerable<object[]> InvalidResetUserPasswordRequestModelsParameters()
    {
        foreach (ResetUserPasswordRequestModel resetUserPasswordRequestModel in GetInvalidResetUserPasswordRequest())
            yield return new object[] { resetUserPasswordRequestModel };
    }

    private static IEnumerable<ResetUserPasswordRequestModel> GetInvalidResetUserPasswordRequest()
    {
        return new []
        {
            new ResetUserPasswordRequestModel
            {
                newPassword = "",
                resetCode = "1234"
            },
            new ResetUserPasswordRequestModel
            {
                newPassword = "test",
                resetCode = ""
            },
            new ResetUserPasswordRequestModel
            {
                resetCode = ""
            },
            new ResetUserPasswordRequestModel()
        };
    }
}