using System;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MountainRepository(DataContext context, IMapper mapper) : IMountainRepository
{
    public void AddMountain(Mountain mountain)
    {
        context.Add(mountain);
    }

    public void DeleteMountain(Mountain mountain)
    {
        context.Remove(mountain);
    }

    public async Task<Mountain?> GetMountainByIdAsync(int mountainId)
    {
        return await context.Mountains
            .FindAsync(mountainId);
    }

    public async Task<IEnumerable<MountainDto>> GetMountainsAsync()
    {
        return await context.Mountains
            .ProjectTo<MountainDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<UserMountain?> GetUserMountainByIdAsync(int mountainId, int userId)
    {
        return await context.UserMountains
            .Include(x => x.Mountain)
            .FirstOrDefaultAsync(x => x.MountainId == mountainId && x.UserId == userId);
    }

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
