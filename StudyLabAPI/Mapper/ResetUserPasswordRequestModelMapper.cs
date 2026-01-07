using Riok.Mapperly.Abstractions;
using StudyLabAPI.Models;
using StudyLabAPI.Models.User.DTOs;

namespace StudyLabAPI.Mapper;

[Mapper]
public partial class ResetUserPasswordRequestModelMapper
{
    public partial ResetUserPasswordReadModel ResetUserPasswordRequestModelToResetUserPasswordReadModel(ResetUserPasswordRequestModel model);
}