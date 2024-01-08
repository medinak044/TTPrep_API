using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using TTSPrep_API.Models;

namespace TTSPrep_API.Data;

public class AppDbContext: IdentityDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Chapter> Chapters { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Speaker> Speakers { get; set; }
    public DbSet<TextBlock> TextBlocks { get; set; }
    public DbSet<TextBlockLabel> TextBlockLabels { get; set; }
    public DbSet<Word> Words { get; set; }

    //protected override void OnModelCreating(ModelBuilder modelBuilder)
    //{
    //    //// Make sure Speakers are deleted when associated Project is deleted
    //    //modelBuilder.Entity<Speaker>()
    //    //    .HasOne(s => s.Project)
    //    //    .WithMany(p => p.Speakers)
    //    //    .OnDelete(DeleteBehavior.Cascade);
    //}
    
}
