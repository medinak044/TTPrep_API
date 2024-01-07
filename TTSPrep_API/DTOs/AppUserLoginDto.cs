using System.ComponentModel.DataAnnotations;

namespace TTSPrep_API.DTOs;

public class AppUserLoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
}
