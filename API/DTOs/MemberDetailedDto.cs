namespace API.DTOs;

public class MemberDetailedDto
{
    public int Id { get; set; }
    public required string KnownAs { get; set; }
    public int Age { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastActive { get; set; }
    public bool PublicProfile { get; set; }
}
