using System.ComponentModel.DataAnnotations;

namespace TTSPrep_API.DTOs;

public class AppUserRegistrationDto
{
    [Required]
    public string UserName { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
}
