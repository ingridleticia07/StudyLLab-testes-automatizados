using FluentValidation;
using StudyLabAPI.Models;

namespace StudyLabAPI.Validators;

public class UserLoginRequestModelValidator : AbstractValidator<UserLoginRequestModel>
{
    public UserLoginRequestModelValidator()
    {
        RuleFor(m => m.email)
            .NotEmpty()
            .EmailAddress();
        RuleFor(m => m.password)
            .NotNull()
            .NotEmpty()
            .MaximumLength(60);
    }
}