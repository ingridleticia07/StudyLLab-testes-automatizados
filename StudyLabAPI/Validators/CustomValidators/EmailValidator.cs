using System.Text.RegularExpressions;
using FluentValidation;

namespace StudyLabAPI.Validators.CustomValidators;

public static partial class EmailValidator
{
    public static IRuleBuilderOptions<T, string> MatchEmail<T>(this IRuleBuilder<T, string> ruleBuilder)
    {
        Regex emailRegex = EmailRegex();
        Regex ufcDomainRegex = UfcDomainRegex();
        
        return ruleBuilder.Must(element =>
        {
            if(element is null) return false;
            
            Match isEmailMatch = emailRegex.Match(element);
            Match domainMatch = ufcDomainRegex.Match(element);
            return isEmailMatch.Success && domainMatch.Success;
        });
    }

    [GeneratedRegex(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$")]
    private static partial Regex EmailRegex();
    [GeneratedRegex(@"(alu\.)?ufc\.br$")]
    private static partial Regex UfcDomainRegex();
}