using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser : IdentityUser<int>
{
    public required string KnownAs { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public bool PublicProfile { get; set; } = false;

    //AppUser - AppUserRole
    public ICollection<AppUserRole> UserRoles { get; set; } = [];

    //AppUser - Mountain
    public ICollection<UserMountain> UserMountains { get; } = [];
}
