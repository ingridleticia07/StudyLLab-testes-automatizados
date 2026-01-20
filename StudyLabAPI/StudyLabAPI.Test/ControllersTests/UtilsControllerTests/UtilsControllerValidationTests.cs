using StudyLabAPI.Services.Application.Utils;

namespace StudyLabAPI.Test.ControllersTests.UtilsControllerTests;

public class UtilsControllerValidationTests
{
    private IUtilsService utilsService { get; }

    public UtilsControllerValidationTests()
    {
        utilsService = new UtilsService();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("NaN")]
    public void ValidateInvalidUserClaimToken(string? claimsFromContext)
    {
        Assert.False(utilsService.ValidateAuthState(claimsFromContext));
    }
    
    [Theory]
    [InlineData("1")]
    [InlineData("2")]
    [InlineData("3")]
    public void ValidateValidUserClaimToken(string? claimsFromContext)
    {
        Assert.True(utilsService.ValidateAuthState(claimsFromContext));
    }
}