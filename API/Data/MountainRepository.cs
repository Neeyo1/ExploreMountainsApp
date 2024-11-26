using System;
using API.DTOs;
using API.Entities;
using API.Helpers;
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

    public async Task<PagedList<MountainDto>> GetMountainsAsync(MountainParams mountainParams)
    {
        var query = context.Mountains.AsQueryable();

        if (mountainParams.Height != 0)
        {
            query = query.Where(x => x.Height == mountainParams.Height);
        }

        if (mountainParams.Name != null)
        {
            query = query.Where(x => x.Name == mountainParams.Name);
        }

        query = mountainParams.Status switch
        {
            "climbed" => query.Where(x => x.UserMountains.Any(y => y.UserId == mountainParams.UserId)),
            "not-climbed" => query.Where(x => !x.UserMountains.Any(y => y.UserId == mountainParams.UserId)),
            _ => query
        };

        query = mountainParams.OrderBy switch
        {
            "highest" => query.OrderByDescending(x => x.Height),
            "shortest" => query.OrderBy(x => x.Height),
            _ => query
        };

        return await PagedList<MountainDto>.CreateAsync(
            query.ProjectTo<MountainDto>(mapper.ConfigurationProvider), 
            mountainParams.PageNumber, mountainParams.PageSize);
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
