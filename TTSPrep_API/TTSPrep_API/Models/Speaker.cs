using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TTSPrep_API.Models;

public class Speaker
{
    [Key]
    public string Id { get; set; }
    public string Name { get; set; }
    [ForeignKey(nameof(Project))]
    public string ProjectId { get; set; }
}
