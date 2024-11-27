using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IUserRepository
{
    Task<IEnumerable<AppUser>> GetUsers();
    Task<AppUser?> GetUserByIdAsync(int userId);
    Task<AppUser?> GetUserByUsernameAsync(string username);
    Task<IEnumerable<MemberDto>> GetMembersAsync();
    Task<MemberDto?> GetMemberByUsernameAsync(string username);
    Task<PagedList<MemberDto>> GetMembersWhoClimbedMountainAsync(MemberParams memberParams);
    Task<PagedList<MountainDto>> GetMountainsClimbedByMemberAsync(MemberParams memberParams);
    Task<bool> Complete();
}
