namespace TTSPrep_API.DTOs
{
    public class AttendeeRequestDto
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string? AppUserId { get; set; }
        public int EventId { get; set; } // One specific event
    }
}
