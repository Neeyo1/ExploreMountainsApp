namespace API.Helpers;

public class MemberParams : PaginationParams
{
    public int MountainId { get; set; }
    public string? KnownAs { get; set; }
    public string OrderBy { get; set; } = "most-recent";
}
