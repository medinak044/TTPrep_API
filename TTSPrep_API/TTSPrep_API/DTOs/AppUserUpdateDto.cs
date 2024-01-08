using TTSPrep_API.Models;

namespace TTSPrep_API.DTOs;

public class AppUserUpdateDto
{
    public string Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
}
