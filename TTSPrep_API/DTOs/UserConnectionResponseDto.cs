namespace TTSPrep_API.DTOs;

// When client sends a request to retrieve all the user's added users
public class UserConnectionResponseDto: AppUserDto
{
    public int UserConnectionId { get; set; }
}
