using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using TTSPrep_API.Models;

namespace TTSPrep_API.Data;

public class AppDbContext: IdentityDbContext
{
    protected readonly IConfiguration configuration;

    public AppDbContext(
        IConfiguration configuration,
        DbContextOptions<AppDbContext> options
        ) : base(options)
    {
        this.configuration = configuration;
    }

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

    //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    //=> optionsBuilder.UseNpgsql(
    //    "PostgreSQL_Supabase_Connection",
    //    options =>
    //    {
    //        //options.RemoteCertificateValidationCallback(MyCallback1);
    //        //options.ProvideClientCertificatesCallback(MyCallback2);
    //    });

    //protected override void OnConfiguring(DbContextOptionsBuilder options)
    //{
    //    options.UseNpgsql(configuration.GetConnectionString("PostgreSQL_Supabase_Connection"));
    //}
}
