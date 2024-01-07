namespace TTSPrep_API.DTOs;

// Provides client with user info + token
// Similar to "AppUserDto"
public class AppUserLoggedInDto
{
    public string Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string Token { get; set; } // Includes Id, UserName, Email in claims
    public string RefreshToken { get; set; }
}
