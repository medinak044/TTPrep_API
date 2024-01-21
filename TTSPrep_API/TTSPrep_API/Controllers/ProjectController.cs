using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using TTSPrep_API.DTOs;
using TTSPrep_API.Helpers;
using TTSPrep_API.Models;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProjectController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<AppUser> _userManager;

    public ProjectController(
        IUnitOfWork unitOfWork,
        UserManager<AppUser> userManager
        )
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
    }

    [HttpGet("GetAllProjects")]
    public async Task<ActionResult> GetAllProjects()
    {
        var result = await _unitOfWork.Projects.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("GetUserProjects")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = UserRoles.User)]
    public async Task<ActionResult> GetUserProjects()
    {
        string loggedInUserId = User.Claims.FirstOrDefault(c => c.Type == "Id").Value;
        if (loggedInUserId == null)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "User id is null" }
            });
        }

        var projects = _unitOfWork.Projects.GetSome(p => p.OwnerId == loggedInUserId);

        return Ok(projects);
    }

    [HttpGet("GetProjectById/{projectId}")]
    public async Task<ActionResult> GetProjectById(string projectId)
    {
        var project = await _unitOfWork.Projects.GetByIdAsync(projectId);
        return Ok(project);
    }


    [HttpPost("CreateProject")]
    public async Task<ActionResult> CreateProject(ProjectReqDto projectReqDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (string.IsNullOrEmpty(projectReqDto.OwnerId))
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Unable to get user Id" }
            });
        }

        var newId = Guid.NewGuid().ToString();
        var timestamp = DateTime.UtcNow;
        

        // Map values
        var project = new Project
        {
            Id = newId,
            Title = projectReqDto.Title.IsNullOrEmpty() ? $"project-{newId}" : projectReqDto.Title, // Make sure project title has a value
            Description = projectReqDto.Description,
            CreatedDate = timestamp,
            LastModifiedDate = timestamp,
            OwnerId = projectReqDto.OwnerId
        };

        await _unitOfWork.Projects.AddAsync(project);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }
        else
        {
            #region Create a default Speaker
            // The relationship between TextBlock and Speaker requires TextBlock to have a VALID speaker Id
            var speaker = new Speaker
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Narrator",
                ProjectId = newId
            };

            await _unitOfWork.Speakers.AddAsync(speaker);
            if (!await _unitOfWork.SaveAsync())
            {
                return BadRequest(new AuthResult()
                {
                    Success = false,
                    Messages = new List<string>() { "Something went wrong while saving" }
                });
            }
            #endregion
        }



        return Ok(project);
    }

   [HttpPut("UpdateProject")]
    public async Task<ActionResult> UpdateProject([FromBody] ProjectReqDto projectReqDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check if exists in db
        var project = await _unitOfWork.Projects.GetByIdAsync(projectReqDto.Id);
        if (project == null)
        {
            return NotFound(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "No matching Id" }
            });
        }

        // Overwrite values
        project.Title = projectReqDto.Title.IsNullOrEmpty() ? $"project-{project.Id}" : projectReqDto.Title; // Make sure project title has a value
        project.Description = projectReqDto.Description;
        project.CurrentChapterId = projectReqDto.CurrentChapterId;

        await _unitOfWork.Projects.UpdateAsync(project);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(project);
    }

    [HttpDelete("RemoveProject/{projectId}")]
    public async Task<ActionResult> RemoveProject(string projectId)
    {
        var project = await _unitOfWork.Projects.GetByIdAsync(projectId);

        if (project == null)
        {
            return NotFound(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "No matching Id" }
            });
        }

        await _unitOfWork.Projects.RemoveAsync(project);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(project);
    }
}
