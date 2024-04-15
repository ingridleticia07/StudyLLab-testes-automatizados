using StudyLabAPI.Controllers;

namespace StudyLabAPI.Test.ControllersTests.UtilsControllerTests;

public class UtilsControllerValidationTests
{
    private IUtilsController utilsController { get; }

    public UtilsControllerValidationTests()
    {
        utilsController = new UtilsController();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("NaN")]
    public void ValidateInvalidUserClaimToken(string? claimsFromContext)
    {
        Assert.False(utilsController.ValidateAuthState(claimsFromContext));
    }
    
    [Theory]
    [InlineData("1")]
    [InlineData("2")]
    [InlineData("3")]
    public void ValidateValidUserClaimToken(string? claimsFromContext)
    {
        Assert.True(utilsController.ValidateAuthState(claimsFromContext));
    }
}