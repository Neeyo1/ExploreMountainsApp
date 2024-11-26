using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMountainRepository
{
    void AddMountain(Mountain mountain);
    void DeleteMountain(Mountain mountain);
    Task<Mountain?> GetMountainByIdAsync(int mountainId);
    Task<PagedList<MountainDto>> GetMountainsAsync(MountainParams mountainParams);

    Task<UserMountain?> GetUserMountainByIdAsync(int mountainId, int userId);
    Task<bool> Complete();
}
