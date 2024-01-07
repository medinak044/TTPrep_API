namespace TTSPrep_API.DTOs;

public class EventRequestDto
{
    public string? Title { get; set; }
    public string? Location { get; set; } // Online, specified address
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? Image { get; set; }
    public string? OwnerId { get; set; }
}
