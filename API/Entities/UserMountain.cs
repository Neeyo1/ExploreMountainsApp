using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("UserMountains")]
public class UserMountain
{
    public int UserId { get; set; }
    public int MountainId { get; set; }
    public AppUser User { get; set; } = null!;
    public Mountain Mountain { get; set; } = null!;
    public bool IsClimbed { get; set; } = true;
    public DateTime ClimbedAt { get; set; } = DateTime.UtcNow;
}
