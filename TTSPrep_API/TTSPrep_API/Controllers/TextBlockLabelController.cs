using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TTSPrep_API.Helpers;
using TTSPrep_API.Models;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TextBlockLabelController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<AppUser> _userManager;

    public TextBlockLabelController(
        IUnitOfWork unitOfWork,
        UserManager<AppUser> userManager
        )
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
    }

    [HttpGet("GetAllTextBlockLabels")]
    public async Task<ActionResult> GetAllTextBlockLabels()
    {
        var result = await _unitOfWork.TextBlockLabels.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("GetTextBlockLabelsByChapterId/{chapterId}")]
    public async Task<ActionResult> GetTextBlockLabelsByChapterId(string chapterId)
    {
        var textBlockLabels = _unitOfWork.TextBlockLabels.GetSome(t => t.ChapterId == chapterId).ToList();
        return Ok(textBlockLabels);
    }

    [HttpGet("GetTextBlockLabelById/{textBlockLabelId}")]
    public async Task<ActionResult> GetTextBlockLabelById(string textBlockLabelId)
    {
        var textBlockLabel = await _unitOfWork.TextBlockLabels.GetByIdAsync(textBlockLabelId);
        return Ok(textBlockLabel);
    }

    [HttpPost("CreateTextBlockLabel")]
    public async Task<ActionResult> CreateTextBlockLabel(TextBlockLabel textBlockLabelForm)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // In case ModelState doesn't throw the error
        if (string.IsNullOrEmpty(textBlockLabelForm.Name))
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Unable to get name" }
            });
        }

        // Map values
        var textBlockLabel = new TextBlockLabel
        {
            Id = Guid.NewGuid().ToString(),
            Name = textBlockLabelForm.Name,
            ChapterId = textBlockLabelForm.ChapterId
        };

        await _unitOfWork.TextBlockLabels.AddAsync(textBlockLabel);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(textBlockLabel);
    }

    [HttpPut("UpdateTextBlockLabel")]
    public async Task<ActionResult> UpdateTextBlockLabel([FromBody] TextBlockLabel textBlockLabelForm)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check if exists in db
        var textBlockLabel = await _unitOfWork.TextBlockLabels.GetByIdAsync(textBlockLabelForm.Id);
        if (textBlockLabel == null)
        {
            return NotFound(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "No matching Id" }
            });
        }

        // Overwrite values
        textBlockLabel.Name = textBlockLabelForm.Name;

        await _unitOfWork.TextBlockLabels.UpdateAsync(textBlockLabel);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(textBlockLabel);
    }

    [HttpDelete("RemoveTextBlockLabel/{textBlockLabelId}")]
    public async Task<ActionResult> RemoveTextBlockLabel(string textBlockLabelId)
    {
        var textBlockLabel = await _unitOfWork.TextBlockLabels.GetByIdAsync(textBlockLabelId);

        if (textBlockLabel == null)
        {
            return NotFound(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "No matching Id" }
            });
        }

        await _unitOfWork.TextBlockLabels.RemoveAsync(textBlockLabel);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(textBlockLabel);
    }
}
