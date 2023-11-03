using Riok.Mapperly.Abstractions;
using StudyLabAPI.Models;

namespace StudyLabAPI.Mapper;

[Mapper]
public partial class ResetUserPasswordRequestModelMapper
{
    
    public partial ResetUserPasswordReadModel ResetUserPasswordRequestModelToResetUserPasswordReadModel(ResetUserPasswordRequestModel model);
}