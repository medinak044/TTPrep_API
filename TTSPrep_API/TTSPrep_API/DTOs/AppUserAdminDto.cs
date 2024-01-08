namespace TTSPrep_API.DTOs;

// Data for client-side users with "Admin" role to access
public class AppUserAdminDto: AppUserDto 
{
    public ICollection<string> Roles { get; set; }
}
