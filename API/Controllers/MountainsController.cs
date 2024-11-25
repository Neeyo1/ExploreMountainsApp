using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class MountainsController(IMountainRepository mountainRepository, IUserRepository userRepository,
    IMapper mapper) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MountainDto>>> GetMountains()
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var mountains = await mountainRepository.GetMountainsAsync();
        foreach (var mountain in mountains)
        {
            var userMountain = await mountainRepository.GetUserMountainByIdAsync(mountain.Id, user.Id);
            if (userMountain != null)
            {
                mountain.IsClimbed = true;
                mountain.ClimbedAt = userMountain.ClimbedAt;
            }
        }

        return Ok(mountains);
    }

    [HttpGet("{mountainId}")]
    public async Task<ActionResult<MountainDto>> GetMountain(int mountainId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var userMountain = await mountainRepository.GetUserMountainByIdAsync(mountainId, user.Id);
        if (userMountain != null) return Ok(mapper.Map<MountainDto>(userMountain));

        var mountain = await mountainRepository.GetMountainByIdAsync(mountainId);
        if (mountain == null) return NotFound();

        return Ok(mapper.Map<MountainDto>(mountain));
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost]
    public async Task<ActionResult<MountainDto>> CreateMountain(MountainCreateDto mountainCreateDto)
    {
        var mountain = mapper.Map<Mountain>(mountainCreateDto);

        mountainRepository.AddMountain(mountain);

        if (await mountainRepository.Complete()) return Ok(mapper.Map<MountainDto>(mountain));
        return BadRequest("Failed to create mountain");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPut("{mountainId}")]
    public async Task<ActionResult<MountainDto>> EditMountain(MountainCreateDto mountainEditDto, int mountainId)
    {
        var mountain = await mountainRepository.GetMountainByIdAsync(mountainId);
        if (mountain == null) return NotFound();

        mapper.Map(mountainEditDto, mountain);

        if (await mountainRepository.Complete()) return Ok(mapper.Map<MountainDto>(mountain));
        return BadRequest("Failed to edit mountain");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{mountainId}")]
    public async Task<ActionResult> DeleteMountain(int mountainId)
    {
        var mountain = await mountainRepository.GetMountainByIdAsync(mountainId);
        if (mountain == null) return NotFound();
        
        mountainRepository.DeleteMountain(mountain);

        if (await mountainRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete mountain");
    }

    [HttpPost("{mountainId}/mark")]
    public async Task<ActionResult> MarkMountianAsClimbed(int mountainId)
    {   
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var mountain = await mountainRepository.GetMountainByIdAsync(mountainId);
        if (mountain == null) return NotFound();

        var userMountain = await mountainRepository.GetUserMountainByIdAsync(mountainId, user.Id);
        if (userMountain != null) return BadRequest("This mountain is already set as climbed");

        var newUserMountain = new UserMountain
        {
            MountainId = mountainId,
            UserId = user.Id
        };

        user.UserMountains.Add(newUserMountain);

        if (await mountainRepository.Complete()) return NoContent();
        return BadRequest("Failed to mark mountain as climbed");
    }

    [HttpPost("{mountainId}/unmark")]
    public async Task<ActionResult> UnmarkMountianAsClimbed(int mountainId)
    {   
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var mountain = await mountainRepository.GetMountainByIdAsync(mountainId);
        if (mountain == null) return NotFound();

        var userMountain = await mountainRepository.GetUserMountainByIdAsync(mountainId, user.Id);
        if (userMountain == null) return BadRequest("This mountain is not set as climbed yet");

        user.UserMountains.Remove(userMountain);

        if (await mountainRepository.Complete()) return NoContent();
        return BadRequest("Failed to mark mountain as climbed");
    }
}
