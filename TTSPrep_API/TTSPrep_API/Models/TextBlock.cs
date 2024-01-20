using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TTSPrep_API.Models;

public class TextBlock
{
    [Key]
    public string Id { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Value must be greater than 0")]
    public int OrderNumber { get; set; }
    public string? OriginalText { get; set; }
    public string? ModifiedText { get; set; }
    [ForeignKey(nameof(Chapter))]
    public string ChapterId { get; set; }
    // Future reference: building bridge tables for Speaker and TextBlockLabel https://www.udemy.com/course/build-an-app-with-aspnet-core-and-angular-from-scratch/learn/lecture/22401476#questions
    public string? SpeakerId { get; set; } // Implied foreign key
    [NotMapped]
    public Speaker? Speaker { get; set; }
    public string? TextBlockLabelId { get; set; } // Implied foreign key
    [NotMapped]
    public TextBlockLabel? TextBlockLabel { get; set; }
}
