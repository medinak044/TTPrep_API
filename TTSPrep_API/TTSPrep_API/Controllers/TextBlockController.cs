using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TTSPrep_API.Helpers;
using TTSPrep_API.Models;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TextBlockController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<AppUser> _userManager;

    public TextBlockController(
        IUnitOfWork unitOfWork,
        UserManager<AppUser> userManager
        )
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
    }

    [HttpGet("GetAllTextBlocks")]
    public async Task<ActionResult> GetAllTextBlocks()
    {
        var result = await _unitOfWork.TextBlocks.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("GetTextBlocksByChapterId/{chapterId}")]
    public async Task<ActionResult> GetTextBlocksByChapterId(string chapterId)
    {
        var textBlocks = _unitOfWork.TextBlocks.GetSome(t => t.ChapterId == chapterId).ToList();
        return Ok(textBlocks);
    }

    [HttpGet("GetTextBlockById/{textBlockId}")]
    public async Task<ActionResult> GetTextBlockById(string textBlockId)
    {
        var textBlock = await _unitOfWork.TextBlocks.GetByIdAsync(textBlockId);
        return Ok(textBlock);
    }

    [HttpPost("CreateTextBlock")]
    public async Task<ActionResult> CreateTextBlock(TextBlock textBlockForm)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // In case ModelState doesn't throw the error
        if (string.IsNullOrEmpty(textBlockForm.ChapterId))
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Unable to get chapter Id" }
            });
        }

        // Get a list of all textBlocks of the chapter
        var textBlocks = _unitOfWork.TextBlocks.GetSome(c => c.ChapterId == textBlockForm.ChapterId).ToList();
        // The new textBlock must have an order number increment the highest number by 1
        int orderNumber = 0;
        foreach (var c in textBlocks)
        {
            if (c.OrderNumber > orderNumber)
                orderNumber = c.OrderNumber;
        }
        orderNumber += 1; // Order number must at least start at 1

        // Map values
        var textBlock = new TextBlock
        {
            Id = Guid.NewGuid().ToString(),
            Label = textBlockForm.Label,
            OrderNumber = orderNumber,
            OriginalText = textBlockForm.OriginalText,
            ModifiedText = textBlockForm.ModifiedText,
            ChapterId = textBlockForm.ChapterId,
            SpeakerId = textBlockForm.SpeakerId
        };

        await _unitOfWork.TextBlocks.AddAsync(textBlock);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(textBlock);
    }

    [HttpPut("UpdateTextBlock")]
    public async Task<ActionResult> UpdateTextBlock([FromBody] TextBlock textBlockForm)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check if exists in db
        var textBlock = await _unitOfWork.TextBlocks.GetByIdAsync(textBlockForm.Id);
        if (textBlock == null)
        {
            return NotFound(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "No matching Id" }
            });
        }

        if (await _unitOfWork.Speakers.GetByIdAsync(textBlockForm.SpeakerId) == null)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "A valid speaker ID must be assigned" }
            });
        }

        #region Overwrite values
        textBlock.Label = textBlockForm.Label;

        // Clearing original text: If text box is empty, make both original and modified text null
        if (string.IsNullOrEmpty(textBlockForm.ModifiedText))
        {
            textBlock.OriginalText = string.Empty;
            textBlock.ModifiedText = string.Empty;
        }
        // Submitting original text: If original text is null, save text as original and modified text
        else if (string.IsNullOrEmpty(textBlock.OriginalText))
        {

            textBlock.OriginalText = textBlockForm.ModifiedText;
            textBlock.ModifiedText = textBlockForm.ModifiedText;
        }
        // Saving modified text: If original text is not null, save text as modified text
        else if (!string.IsNullOrEmpty(textBlock.OriginalText))
        {
            textBlock.ModifiedText = textBlockForm.ModifiedText;
        }

        textBlock.SpeakerId = textBlockForm.SpeakerId;
        #endregion

        await _unitOfWork.TextBlocks.UpdateAsync(textBlock);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(textBlock);
    }

    //[HttpPut("UpdateTextBlockOrderNumber")]
    //public async Task<ActionResult> UpdateTextBlockOrderNumber([FromBody] Chapter chapterForm)
    //{
    //Increment all the order numbers of items by 1 to make space for the submitted items
    //Ex: Insert item between 1 and 2. Increment items 2 and up by 1.
    //}

    [HttpDelete("RemoveTextBlock/{textBlockId}")]
    public async Task<ActionResult> RemoveTextBlock(string textBlockId)
    {
        var textBlock = await _unitOfWork.TextBlocks.GetByIdAsync(textBlockId);

        if (textBlock == null)
        {
            return NotFound(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "No matching Id" }
            });
        }

        await _unitOfWork.TextBlocks.RemoveAsync(textBlock);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(textBlock);
    }
}