using FluentValidation;
using StudyLabAPI.Models;
using StudyLabAPI.Validators.CustomValidators;

namespace StudyLabAPI.Validators;

public class RegisterUserRequestModelValidator : AbstractValidator<RegisterUserRequestModel>
{
    public RegisterUserRequestModelValidator()
    {
        RuleFor(m => m.username)
            .NotNull()
            .NotEmpty()
            .MaximumLength(45);
        RuleFor(m => m.email)
            .NotNull()
            .MatchEmail();
        RuleFor(m => m.password)
            .NotNull()
            .NotEmpty()
            //.MinimumLength(8)
            .MaximumLength(60);
        RuleFor(m => m.codigoUsuario)
            .NotNull()
            .GreaterThanOrEqualTo(0);
        RuleFor(m => m.role)
            .IsInEnum();
        RuleFor(m => m.codeCurso)
            .NotNull()
            .GreaterThanOrEqualTo(0);
        RuleFor(m => m.imagem)
            .NotNull()
            .NotEmpty()
            .MaximumLength(45)
            .When(m => m.imagem is not null);
    }
}