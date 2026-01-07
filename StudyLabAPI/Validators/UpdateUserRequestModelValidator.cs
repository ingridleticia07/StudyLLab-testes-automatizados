using FluentValidation;
using StudyLabAPI.Models;
using StudyLabAPI.Models.User.DTOs;
using StudyLabAPI.Validators.CustomValidators;

namespace StudyLabAPI.Validators;

public class UpdateUserRequestModelValidator : AbstractValidator<UpdateUserRequestModel>
{
    public UpdateUserRequestModelValidator()
    {
        RuleFor(m => m.username)
            .NotNull()
            .NotEmpty()
            .MaximumLength(45)
            .When(f => f.username is not null);
        RuleFor(m => m.password)
            .NotNull()
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(20)
            .When(f => f.password is not null);
        RuleFor(m => m.role)
            .IsInEnum()
            .When(f => f.role is not null);
        RuleFor(m => m.codeCurso)
            .NotNull()
            .GreaterThan(0)
            .When(f => f.codeCurso is not null);
        RuleFor(m => m.imagem)
            .NotNull()
            .NotEmpty()
            .When(m => m.imagem is not null);
    }
}