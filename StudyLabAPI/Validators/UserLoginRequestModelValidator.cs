using FluentValidation;
using StudyLabAPI.Models;
using StudyLabAPI.Validators.CustomValidators;

namespace StudyLabAPI.Validators;

public class UserLoginRequestModelValidator : AbstractValidator<UserLoginRequestModel>
{
    public UserLoginRequestModelValidator()
    {
        RuleFor(m => m.email)
            .NotEmpty()
            .MatchEmail();
        RuleFor(m => m.password)
            .NotNull()
            .NotEmpty()
            .MinimumLength(8);
    }
}