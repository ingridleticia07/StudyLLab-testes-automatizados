using FluentValidation;
using StudyLabAPI.Models;

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