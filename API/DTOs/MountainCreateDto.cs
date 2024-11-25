using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class MountainCreateDto
{
    [Required] public required string Name { get; set; }
    [Required] public required string Description { get; set; }
    [Required] public int Height { get; set; }
    [Required] public required string Latitude { get; set; }
    [Required] public required string Longitude { get; set; }
}
