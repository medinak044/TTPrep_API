using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TTSPrep_API.Models;

public class Word
{
    [Key]
    public string Id { get; set; }
    public string OriginalSpelling { get; set; }
    public string? ModifiedSpelling { get; set; }
    [ForeignKey(nameof(Project))]
    public string ProjectId { get; set; }
}
