using System;

namespace API.DTOs;

public class MountainDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public int Height { get; set; }
    public float Latitude { get; set; }
    public float Longitude { get; set; }
    public bool IsClimbed { get; set; }
    public DateTime ClimbedAt { get; set; }
}
