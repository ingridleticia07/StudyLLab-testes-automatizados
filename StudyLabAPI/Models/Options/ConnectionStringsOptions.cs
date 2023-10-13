namespace StudyLabAPI.Models.Options;

public class ConnectionStringsOptions
{
    public const string CONNECTION_STRING = "ConnectionStrings";

    public string PostgresDbConnString { get; set; } = string.Empty;
}