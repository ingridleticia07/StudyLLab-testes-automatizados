using FluentValidation;
using StudyLabAPI.Models;

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
            .EmailAddress();
        RuleFor(m => m.password)
            .NotNull()
            .NotEmpty()
            //.MinimumLength(8)
            .MaximumLength(60);
        RuleFor(m => m.codigoUsuario)
            .NotNull()
            .NotEmpty();
        RuleFor(m => m.role)
            .NotNull()
            .NotEmpty()
            .IsInEnum();
        RuleFor(m => m.codeCurso)
            .NotNull()
            .NotEmpty();
        RuleFor(m => m.imagem)
            .NotNull()
            .NotEmpty()
            .MaximumLength(45)
            .When(m => m.imagem is not null);
    }
}