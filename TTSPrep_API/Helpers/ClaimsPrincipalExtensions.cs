using System.Security.Claims;

namespace TTSPrep_API.Helpers;

public static class ClaimsPrincipalExtensions
{
    // Used for .NET session (cookie) authentication
    public static string GetUserId(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.NameIdentifier).Value;
    }
}
