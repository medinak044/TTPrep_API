using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TTSPrep_API.DTOs;
using TTSPrep_API.Helpers;
using TTSPrep_API.Models;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ChapterController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<AppUser> _userManager;

    public ChapterController(
        IUnitOfWork unitOfWork,
        UserManager<AppUser> userManager
        )
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
    }

    [HttpGet("GetAllChapters")]
    public async Task<ActionResult> GetAllChapters()
    {
        var result = await _unitOfWork.Chapters.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("GetChaptersByProjectId/{projectId}")]
    public async Task<ActionResult> GetChaptersByProjectId(string projectId)
    {
        var chapters = _unitOfWork.Chapters.GetSome(c => c.ProjectId == projectId).ToList();
        return Ok(chapters);
    }

    [HttpGet("GetChapterById/{chapterId}")]
    public async Task<ActionResult> GetChapterById(string chapterId)
    {
        var chapter = await _unitOfWork.Chapters.GetByIdAsync(chapterId);
        return Ok(chapter);
    }

    [HttpPost("CreateChapter")]
    public async Task<ActionResult> CreateChapter(Chapter chapterForm)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // In case ModelState doesn't throw the error
        if (string.IsNullOrEmpty(chapterForm.ProjectId))
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Unable to get project Id" }
            });
        }

        // Get a list of all chapters of the project
        var chapters = _unitOfWork.Chapters.GetSome(c => c.ProjectId == chapterForm.ProjectId).ToList();
        // The new chapter must have an order number increment the highest number by 1
        int orderNumber = 0;
        foreach (var c in chapters)
        {
            if (c.OrderNumber > orderNumber)
                orderNumber = c.OrderNumber;
        }
        orderNumber += 1; // Order number must at least start at 1

        // Map values
        var chapter = new Chapter
        {
            Id = Guid.NewGuid().ToString(),
            Title = chapterForm.Title.IsNullOrEmpty() ? $"Chapter {orderNumber}" : chapterForm.Title,
            OrderNumber = orderNumber,
            ProjectId = chapterForm.ProjectId,
        };

        await _unitOfWork.Chapters.AddAsync(chapter);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(chapter);
    }

    //[HttpPut("UpdateChapterOrderNumber")]
    //public async Task<ActionResult> UpdateChapterOrderNumber([FromBody] Chapter chapterForm)
    //{
    //Increment all the order numbers of items by 1 to make space for the submitted items
    //Ex: Insert item between 1 and 2. Increment items 2 and up by 1.
    //}


    [HttpPut("UpdateChapter")]
    public async Task<ActionResult> UpdateChapter([FromBody] Chapter chapterForm)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check if exists in db
        var chapter = await _unitOfWork.Chapters.GetByIdAsync(chapterForm.Id);
        if (chapter == null)
        {
            return NotFound(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "No matching Id" }
            });
        }

        // Overwrite values
        chapter.Title = chapterForm.Title;

        await _unitOfWork.Chapters.UpdateAsync(chapter);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(chapter);
    }

    [HttpDelete("RemoveChapter/{chapterId}")]
    public async Task<ActionResult> RemoveChapter(string chapterId)
    {
        var chapter = await _unitOfWork.Chapters.GetByIdAsync(chapterId);

        if (chapter == null)
        {
            return NotFound(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "No matching Id" }
            });
        }

        // TODO: Change all the order numbers of chapters greater than the deleted chapter
        // Update range()





        await _unitOfWork.Chapters.RemoveAsync(chapter);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(chapter);
    }
}
