namespace StudyLabAPI.Models.User.DTOs;

public record ConfirmUserEmailRequestModel
{
    public string confirmationCode { get; init; }
}