namespace API.DTOs;

public class MemberDto
{
    public int Id { get; set; }
    public required string KnownAs { get; set; }
    public int Age { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastActive { get; set; }
    //public IEnumerable<MountainDto> Mountains { get; } = [];
}
