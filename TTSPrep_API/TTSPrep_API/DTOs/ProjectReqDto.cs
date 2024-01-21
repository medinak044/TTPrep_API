using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using TTSPrep_API.Models;

namespace TTSPrep_API.DTOs;

public class ProjectReqDto
{
    public string Id { get; set; }
    public string? Title { get; set; } // Default to "project_123" (based on project id)
    public string? Description { get; set; }
    public string OwnerId { get; set; }
    public string? CurrentChapterId { get; set; }
}
