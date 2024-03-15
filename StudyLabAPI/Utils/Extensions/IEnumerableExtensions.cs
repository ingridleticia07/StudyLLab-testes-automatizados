namespace StudyLabAPI.Utils.Extensions;

public static class EnumerableExtensions
{
    public static string ToSeparatedString(this IEnumerable<string> enumerable, char separator = ' ') => 
        string.Join(separator, enumerable);
    public static string FuseString(this IEnumerable<string> enumerable) => 
        string.Join(string.Empty, enumerable);
}