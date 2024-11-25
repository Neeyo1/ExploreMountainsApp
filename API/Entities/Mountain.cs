namespace API.Entities;

public class Mountain
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public int Height { get; set; }
    public required string Latitude { get; set; }
    public required string Longitude { get; set; }

    //Mountain - AppUser
    public ICollection<UserMountain> UserMountains { get; } = [];
}
