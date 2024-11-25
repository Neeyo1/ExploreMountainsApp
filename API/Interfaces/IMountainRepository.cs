using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IMountainRepository
{
    void AddMountain(Mountain mountain);
    void DeleteMountain(Mountain mountain);
    Task<Mountain?> GetMountainByIdAsync(int mountainId);
    Task<IEnumerable<MountainDto>> GetMountainsAsync();

    Task<UserMountain?> GetUserMountainByIdAsync(int mountainId, int userId);
    Task<bool> Complete();
}
