namespace StudyLabAPI.Validators.CustomValidators.RequestQuery;

public record PageValidator(int page, int pageSize)
{
    public bool isValid
    {
        get
        {
            bool isPageValid = page > 0;
            bool isPageSizeValid = pageSize > 0;
            
            return isPageValid && isPageSizeValid;
        }
    }
}