using System.Text.RegularExpressions;
using FluentValidation;

namespace StudyLabAPI.Validators.CustomValidators;

public static partial class EmailValidator
{
    public static IRuleBuilderOptions<T, string> MatchEmail<T>(this IRuleBuilder<T, string> ruleBuilder)
    {
        Regex emailRegex = MyRegex();
        
        return ruleBuilder.Must(element =>
        {
            if(element is null) return false;
            Match match = emailRegex.Match(element);
            return match.Success;
        });
    }

    [GeneratedRegex(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$")]
    private static partial Regex MyRegex();
}