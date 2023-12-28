using API.Entities;
using Microsoft.EntityFrameworkCore;
namespace API.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }
     
    public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike>Likes {get;set;}
    public DbSet<Message>Messages {get;set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<UserLike>()
                    .HasKey(k=> new {k.SourceUserId,k.TargetUserId});

        modelBuilder.Entity<UserLike>()
                    .HasOne(s=>s.SourceUser)
                    .WithMany(l=>l.LikedUsers)
                    .HasForeignKey(f=>f.SourceUserId)
                    .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<UserLike>()
                    .HasOne(s=>s.TargetUser)
                    .WithMany(l=>l.LikedByUsers)
                    .HasForeignKey(f=>f.TargetUserId)
                    .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<Message>()
                    .HasOne(s=>s.Recipient)
                    .WithMany(l=>l.MessagesRecived)
                    .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Message>()
                    .HasOne(s=>s.Sender)
                    .WithMany(l=>l.MessagesSent)
                    .OnDelete(DeleteBehavior.Restrict);
    }
}
