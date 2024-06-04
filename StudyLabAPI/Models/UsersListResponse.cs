namespace StudyLabAPI.Models;

public class UsersListResponse
{
    public int maxPage { get; init; }
    public int usersCount { get; init; }
    public int pageCount { get; init; }
    public required IReadOnlyList<UserReadModel> users { get; init; }
}