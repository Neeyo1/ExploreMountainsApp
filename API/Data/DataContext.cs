using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : IdentityDbContext<AppUser, AppRole, int,
    IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>,
    IdentityUserToken<int>>(options)
{
    public DbSet<Mountain> Mountains { get; set; }
    public DbSet<UserMountain> UserMountains { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        //AppUser - AppRole
        builder.Entity<AppUser>()
            .HasMany(x => x.UserRoles)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId)
            .IsRequired();

        builder.Entity<AppRole>()
            .HasMany(x => x.UserRoles)
            .WithOne(x => x.Role)
            .HasForeignKey(x => x.RoleId)
            .IsRequired();

        //AppUser - Mountain
        builder.Entity<UserMountain>().HasKey(x => new {x.UserId, x.MountainId});

        builder.Entity<AppUser>()
            .HasMany(x => x.UserMountains)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId)
            .IsRequired();

        builder.Entity<Mountain>()
            .HasMany(x => x.UserMountains)
            .WithOne(x => x.Mountain)
            .HasForeignKey(x => x.MountainId)
            .OnDelete(DeleteBehavior.NoAction)  //Required for future use of SqlServer
            .IsRequired();
    }
}
