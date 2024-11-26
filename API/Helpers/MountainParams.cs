namespace API.Helpers;

public class MountainParams : PaginationParams
{
    public int UserId { get; set; }
    public string? Name { get; set; }
    public int Height { get; set; }
    public string Status { get; set; } = "all";
    public string OrderBy { get; set; } = "highest";
}
