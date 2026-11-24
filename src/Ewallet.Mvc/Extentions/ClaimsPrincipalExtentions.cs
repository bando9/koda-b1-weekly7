using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Ewallet.Mvc.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static long GetRequiredUserId(this ClaimsPrincipal user)
    {
        var sub = user.FindFirstValue(JwtRegisteredClaimNames.Sub)
                  ?? user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!long.TryParse(sub, out var userId) || userId <= 0)
        {
            throw new UnauthorizedAccessException("Token tidak memuat identitas pengguna yang valid.");
        }

        return userId;
    }

    public static bool IsAdmin(this ClaimsPrincipal user)
    {
        return user.IsInRole("ADMIN") || user.FindAll("role").Any(c => c.Value == "ADMIN");
    }
}