namespace API.DTOs;

public class MemberDto
{
    public int Id { get; set; }
    public required string KnownAs { get; set; }
    public bool PublicProfile { get; set; }
    public DateTime ClimbedAt { get; set; }
    //public IEnumerable<MountainDto> Mountains { get; } = [];
}
