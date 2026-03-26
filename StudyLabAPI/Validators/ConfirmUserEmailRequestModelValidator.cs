using FluentValidation;
using StudyLabAPI.Models;
using StudyLabAPI.Models.User.DTOs;

namespace StudyLabAPI.Validators;

public class ConfirmUserEmailRequestModelValidator : AbstractValidator<ConfirmUserEmailRequestModel>
{
    public ConfirmUserEmailRequestModelValidator()
    {
        RuleFor(m => m.confirmationCode)
            .NotNull()
            .NotEmpty();
    }
}