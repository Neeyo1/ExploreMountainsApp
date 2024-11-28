using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepository, IMapper mapper) : BaseApiController
{
    [HttpGet("{userToFindId}")]
    public async Task<ActionResult<MemberDto>> GetUser(int userToFindId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var userToFind = await userRepository.GetUserByIdAsync(userToFindId);
        if (userToFind == null) return NotFound();
        if (userToFind.PublicProfile == false && userToFindId != user.Id) return BadRequest("This user's info is private");
        
        return Ok(mapper.Map<MemberDetailedDto>(userToFind));
    }

    [HttpGet("mountains-climbed-by-member")]
    public async Task<ActionResult<IEnumerable<MountainDto>>> GetUsersWhoClimbedMountain(
        string knownAs, [FromQuery] MemberParams memberParams)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var mountains = await userRepository.GetMountainsClimbedByMemberAsync(memberParams);
        Response.AddPaginationHeader(mountains);

        return Ok(mountains);
    }
}
