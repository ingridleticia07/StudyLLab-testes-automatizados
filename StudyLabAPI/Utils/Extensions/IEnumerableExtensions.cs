namespace StudyLabAPI.Utils.Extensions;

public static class EnumerableExtensions
{
    public static string ToSeparatedString(this IEnumerable<string> enumerable, char separator = ' ') => 
        string.Join(separator, enumerable);
}