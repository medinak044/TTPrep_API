using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TTSPrep_API.Models;

namespace TTSPrep_API.Data;

public class AppDbContext: IdentityDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Chapter> Chapters { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Speaker> Speakers { get; set; }
    public DbSet<TextBlock> TextBlocks { get; set; }
    public DbSet<Word> Words { get; set; }

}
