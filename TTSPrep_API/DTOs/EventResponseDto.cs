using TTSPrep_API.Models;

namespace TTSPrep_API.DTOs;

public class EventResponseDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Location { get; set; } // Online, specified address
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? Image { get; set; }
    public string? OwnerId { get; set; }
    public AppUserDto? Owner { get; set; }
    public ICollection<Attendee>? Attendees { get; set; }
}
