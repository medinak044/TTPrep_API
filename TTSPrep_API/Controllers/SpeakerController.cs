using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TTSPrep_API.Helpers;
using TTSPrep_API.Models;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SpeakerController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<AppUser> _userManager;

    public SpeakerController(
        IUnitOfWork unitOfWork,
        UserManager<AppUser> userManager
        )
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
    }

    [HttpGet("GetAllSpeakers")]
    public async Task<ActionResult> GetAllSpeakers()
    {
        var result = await _unitOfWork.Speakers.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("GetSpeakersByProjectId/{projectId}")]
    public async Task<ActionResult> GetSpeakersByProjectId(string projectId)
    {
        var speakers = _unitOfWork.Speakers.GetSome(s => s.ProjectId == projectId).ToList();
        return Ok(speakers);
    }

    [HttpGet("GetSpeakerById/{speakerId}")]
    public async Task<ActionResult> GetSpeakerById(string speakerId)
    {
        var speaker = await _unitOfWork.Speakers.GetByIdAsync(speakerId);
        return Ok(speaker);
    }

    [HttpPost("CreateSpeaker")]
    public async Task<ActionResult> CreateSpeaker(Speaker speakerForm)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // In case ModelState doesn't throw the error
        if (string.IsNullOrEmpty(speakerForm.ProjectId))
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Unable to get project ID" }
            });
        }

        // Map values
        var speaker = new Speaker
        {
            Id = Guid.NewGuid().ToString(),
            Name = speakerForm.Name,
            ProjectId = speakerForm.ProjectId
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

        return Ok(speaker);
    }

    [HttpPut("UpdateSpeaker")]
    public async Task<ActionResult> UpdateSpeaker([FromBody] Speaker speakerForm)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check if exists in db
        var speaker = await _unitOfWork.Speakers.GetByIdAsync(speakerForm.Id);
        if (speaker == null)
        {
            return NotFound(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "No matching ID" }
            });
        }
        else if (speaker.Name.Equals("Narrator"))
        {
            // Make sure the default speaker cannot be edited or deleted
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Default speaker cannot be edited or deleted" }
            });
        }

        // Overwrite values
        speaker.Name = speakerForm.Name;

        await _unitOfWork.Speakers.UpdateAsync(speaker);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(speaker);
    }

    [HttpDelete("RemoveSpeaker/{speakerId}")]
    public async Task<ActionResult> RemoveSpeaker(string speakerId)
    {
        var speaker = await _unitOfWork.Speakers.GetByIdAsync(speakerId);

        if (speaker == null)
        {
            return NotFound(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "No matching ID" }
            });
        }
        else if (speaker.Name.Equals("Narrator"))
        {
            // Make sure the default speaker cannot be edited or deleted
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Default speaker cannot be edited or deleted" }
            });
        }

        await _unitOfWork.Speakers.RemoveAsync(speaker);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(speaker);
    }
}
