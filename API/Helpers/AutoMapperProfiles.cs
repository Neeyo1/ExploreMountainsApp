using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, UserDto>();
        CreateMap<RegisterDto, AppUser>();
        CreateMap<LoginDto, AppUser>();
        CreateMap<AppUser, MemberDetailedDto>()
            .ForMember(
                x => x.Age, y => y.MapFrom(z => z.DateOfBirth.CalculateAge())
            );
        CreateMap<Mountain, MountainDto>();
        CreateMap<UserMountain, MountainDto>()
            .ForMember(x => x.Id, y => y.MapFrom(z => z.MountainId))
            .ForMember(x => x.Name, y => y.MapFrom(z => z.Mountain.Name))
            .ForMember(x => x.Description, y => y.MapFrom(z => z.Mountain.Description))
            .ForMember(x => x.Height, y => y.MapFrom(z => z.Mountain.Height))
            .ForMember(x => x.Latitude, y => y.MapFrom(z => z.Mountain.Latitude))
            .ForMember(x => x.Longitude, y => y.MapFrom(z => z.Mountain.Longitude));
        CreateMap<MountainCreateDto, Mountain>();
        CreateMap<UserMountain, MemberDto>()
            .ForMember(x => x.Id, y => y.MapFrom(z => z.UserId))
            .ForMember(x => x.KnownAs, y => y.MapFrom(z => z.User.KnownAs))
            .ForMember(x => x.PublicProfile, y => y.MapFrom(z => z.User.PublicProfile))
            .ForMember(x => x.ClimbedAt, y => y.MapFrom(z => z.ClimbedAt));

        CreateMap<string, DateOnly>().ConvertUsing(s => DateOnly.Parse(s));
        CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        CreateMap<DateTime?, DateTime?>().ConvertUsing(d => d.HasValue 
            ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null);
    }
}
