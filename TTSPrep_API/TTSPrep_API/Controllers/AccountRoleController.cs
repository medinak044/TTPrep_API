using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TTSPrep_API.DTOs;
using TTSPrep_API.Models;

namespace TTSPrep_API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountRoleController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<AccountController> _logger;
    private readonly IMapper _mapper;

    public AccountRoleController(
        UserManager<AppUser> userManager,
        RoleManager<IdentityRole> roleManager,
        ILogger<AccountController> logger,
        IMapper mapper
        )
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _logger = logger;
        _mapper = mapper;
    }

    [HttpGet("GetAllUsers")]
    public async Task<ActionResult> GetAllUsers()
    {
        List<AppUser> users = await _userManager.Users.ToListAsync();

        List<AppUserAdminDto> resultList = new List<AppUserAdminDto>();

        // Map respective roles on each user object
        foreach (var user in users)
        {
            // Map user values to a dto
            //AppUserAdminDto dto = _mapper.Map<AppUserAdminDto>(user);
            AppUserAdminDto dto = new AppUserAdminDto { 
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                DateCreated = user.DateCreated,
            };
            // Add found roles to dto
            dto.Roles = await _userManager.GetRolesAsync(user);
            // Add dto to the list
            resultList.Add(dto);
        }

        return Ok(resultList);
    }

    [HttpGet("GetAllAvailableRoles")]
    public async Task<ActionResult> GetAllAvailableRoles()
    {
        var roles = await _roleManager.Roles.ToListAsync();
        return Ok(roles);
    }

    [HttpGet("GetUserRoles/{email}")]
    public async Task<ActionResult> GetUserRoles(string email)
    {
        // Check if email is valid
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            _logger.LogInformation($"The user with the {email} does not exist");
            return BadRequest(new { error = $"User does not exist" });
        }

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(roles);
    }

    [HttpPost("CreateRole/{roleName}")]
    public async Task<ActionResult> CreateRole(string roleName)
    {
        // Check if role exists
        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (roleExists)
            return BadRequest(new { error = "Role already exists" });

        // Check if role has been added to db successfully
        var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
        if (!result.Succeeded)
        {
            _logger.LogInformation($"The role {roleName} has not been added");
            return BadRequest(new { error = $"The role {roleName} has not been added" });
        }

        _logger.LogInformation($"The role {roleName} has been added successfully");
        return Ok(new { result = $"The role {roleName} has been added successfully" });
    }

    [HttpPost("AddUserToRole")]
    public async Task<ActionResult> AddUserToRole(AccountRoleDto accountRoleDto)
    {
        // Check if the user exists
        var user = await _userManager.FindByEmailAsync(accountRoleDto.Email);
        if (user == null)
        {
            _logger.LogInformation($"The user with the {accountRoleDto.Email} does not exist");
            return BadRequest(new { error = $"User does not exist" });
        }

        // Check if the role exists
        bool roleExists = await _roleManager.RoleExistsAsync(accountRoleDto.RoleName);
        if (!roleExists)
        {
            _logger.LogInformation($"The role {accountRoleDto.RoleName} does not exist");
            return BadRequest(new { error = $"Role does not exist" });
        }

        // Check if user already has the role
        var userRoles = await _userManager.GetRolesAsync(user);
        foreach (var userRole in userRoles)
        {
            if (userRole == accountRoleDto.RoleName)
            {
                _logger.LogInformation($"User {user} already has role {accountRoleDto.RoleName}");
                return BadRequest(new { error = $"User {user} already has role {accountRoleDto.RoleName}" });
            }
        }

        var result = await _userManager.AddToRoleAsync(user, accountRoleDto.RoleName);

        // Check if the user has been assigned to the role successfully
        if (!result.Succeeded)
        {
            _logger.LogInformation($"The user was not able to be added to the role");
            return BadRequest(new { error = $"The user was not able to be added to the role" });
        }

        _logger.LogInformation($"User successfully added to the role");
        return Ok(new { result = $"User successfully added to the role" });
    }

    [HttpPost("RemoveUserFromRole")]
    public async Task<ActionResult> RemoveUserFromRole(AccountRoleDto accountRoleDto)
    {
        // Check if the user exists
        var user = await _userManager.FindByEmailAsync(accountRoleDto.Email);
        if (user == null)
        {
            _logger.LogInformation($"The user with the {accountRoleDto.Email} does not exist");
            return BadRequest(new { error = $"User does not exist" });
        }

        // Check if the role exists
        bool roleExists = await _roleManager.RoleExistsAsync(accountRoleDto.RoleName);
        if (!roleExists)
        {
            _logger.LogInformation($"The role {accountRoleDto.RoleName} does not exist");
            return BadRequest(new { error = $"Role does not exist" });
        }

        var result = await _userManager.RemoveFromRoleAsync(user, accountRoleDto.RoleName);

        // Check if the user has been removed from the role successfully
        if (!result.Succeeded)
        {
            _logger.LogInformation($"Unable to remove user {accountRoleDto.Email} from the role {accountRoleDto.RoleName}");
            return BadRequest(new { error = $"Unable to remove user {accountRoleDto.Email} from the role {accountRoleDto.RoleName}" });
        }

        _logger.LogInformation($"User {accountRoleDto.Email} removed from the role {accountRoleDto.RoleName}");
        return Ok(new { result = $"User {accountRoleDto.Email} removed from the role {accountRoleDto.RoleName}" });

    }
}
