using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TTSPrep_API.Helpers;
using TTSPrep_API.Models;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class WordController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<AppUser> _userManager;

    public WordController(
        IUnitOfWork unitOfWork,
        UserManager<AppUser> userManager
        )
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
    }

    [HttpGet("GetAllWords")]
    public async Task<ActionResult> GetAllWords()
    {
        var result = await _unitOfWork.Words.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("GetWordsByProjectId/{projectId}")]
    public async Task<ActionResult> GetWordsByProjectId(string projectId)
    {
        var words = _unitOfWork.Words.GetSome(w => w.ProjectId == projectId).ToList();
        return Ok(words);
    }

    [HttpGet("GetWordById/{wordId}")]
    public async Task<ActionResult> GetWordById(string wordId)
    {
        var word = await _unitOfWork.Words.GetByIdAsync(wordId);
        return Ok(word);
    }

    [HttpPost("CreateWord")]
    public async Task<ActionResult> CreateWord(Word wordForm)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // In case ModelState doesn't throw the error
        if (string.IsNullOrEmpty(wordForm.ProjectId))
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Unable to get project Id" }
            });
        }

        // Get a list of all words of the project
        var words = _unitOfWork.Words.GetSome(w => w.ProjectId == wordForm.ProjectId).ToList();

        // Map values
        var word = new Word
        {
            Id = Guid.NewGuid().ToString(),
            OriginalSpelling = wordForm.OriginalSpelling,
            ModifiedSpelling = wordForm.ModifiedSpelling,
            ProjectId = wordForm.ProjectId,
        };

        await _unitOfWork.Words.AddAsync(word);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(word);
    }

    [HttpPut("UpdateWord")]
    public async Task<ActionResult> UpdateWord([FromBody] Word wordForm)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check if exists in db
        var word = await _unitOfWork.Words.GetByIdAsync(wordForm.Id);
        if (word == null)
        {
            return NotFound(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "No matching Id" }
            });
        }

        // Overwrite values
        word.OriginalSpelling = wordForm.OriginalSpelling;
        word.ModifiedSpelling = wordForm.ModifiedSpelling;

        await _unitOfWork.Words.UpdateAsync(word);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(word);
    }

    [HttpDelete("RemoveWord/{wordId}")]
    public async Task<ActionResult> RemoveWord(string wordId)
    {
        var word = await _unitOfWork.Words.GetByIdAsync(wordId);

        if (word == null)
        {
            return NotFound(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "No matching Id" }
            });
        }

        await _unitOfWork.Words.RemoveAsync(word);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(word);
    }
}