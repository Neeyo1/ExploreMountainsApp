using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
{
    public async Task<IEnumerable<AppUser>> GetUsers()
    {
        return await context.Users
            .ToListAsync();
    }

    public async Task<AppUser?> GetUserByIdAsync(int userId)
    {
        return await context.Users
            .FindAsync(userId);
    }

    public async Task<AppUser?> GetUserByUsernameAsync(string username)
    {
        return await context.Users
            .SingleOrDefaultAsync(x => x.UserName == username);
    }

    public async Task<IEnumerable<MemberDto>> GetMembersAsync()
    {
        return await context.Users
            .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<MemberDto?> GetMemberByUsernameAsync(string username)
    {
        return await context.Users
            .Where(x => x.UserName == username)
            .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }

    public async Task<PagedList<MemberDto>>GetMembersWhoClimbedMountain(MemberParams memberParams)
    {
        var query = context.UserMountains.AsQueryable();

        query = query.Where(x => x.MountainId == memberParams.MountainId);

        if (memberParams.KnownAs != null)
        {
            query = query.Where(x => x.User.KnownAs == memberParams.KnownAs);
        }

        query = memberParams.OrderBy switch
        {
            "most-recent" => query.OrderByDescending(x => x.ClimbedAt),
            "most-latest" => query.OrderBy(x => x.ClimbedAt),
            _ => query
        };

        return await PagedList<MemberDto>.CreateAsync(
            query.ProjectTo<MemberDto>(mapper.ConfigurationProvider), 
            memberParams.PageNumber, memberParams.PageSize);
    }

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
