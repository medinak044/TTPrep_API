using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TTSPrep_API.Models;

public class Chapter
{
    [Key]
    public string Id { get; set; }
    public string? Title { get; set; } // Default to "Chapter 1" (based on OrderNumber)
    [Range(1, int.MaxValue, ErrorMessage = "Value must be greater than 0")]
    public int OrderNumber { get; set; }
    /* Ex: If you want the item to relocate to 2 in the list, 
     * first add +1 to items 2 and above, then assign the item to 2*/
    [ForeignKey(nameof(Project))]
    public string ProjectId { get; set; }
    public ICollection<TextBlock>? TextBlocks { get; set; }
    public ICollection<TextBlockLabel>? TextBlockLabels { get; set; }
}
