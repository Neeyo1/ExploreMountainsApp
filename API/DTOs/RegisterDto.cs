using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    [StringLength(12, MinimumLength = 4)]
    public required string Username { get; set; }

    [Required]
    [StringLength(12, MinimumLength = 8)]
    public required string Password { get; set; }

    [Required]
    [StringLength(24, MinimumLength = 4)]
    public required string KnownAs { get; set; }

    [Required]
    public required string DateOfBirth { get; set; }

    [Required]
    public bool PublicProfile { get; set; }
}
