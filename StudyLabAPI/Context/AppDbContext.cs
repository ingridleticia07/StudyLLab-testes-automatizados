using Microsoft.EntityFrameworkCore;

namespace StudyLabAPI.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions options) : base(options)
    { }
}