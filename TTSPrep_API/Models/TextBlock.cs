using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TTSPrep_API.Models;

public class TextBlock
{
    [Key]
    public string Id { get; set; }
    public string? Label { get; set; }
    [Range(1, int.MaxValue)]
    public int OrderNumber { get; set; }
    public string? OriginalText { get; set; }
    public string? ModifiedText { get; set; }
    [ForeignKey(nameof(Chapter))]
    public string ChapterId { get; set; }
}
