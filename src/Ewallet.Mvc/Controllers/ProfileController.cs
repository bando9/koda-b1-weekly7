using System.ComponentModel.DataAnnotations;
using Ewallet.Application.Repositories;
using Ewallet.Domain.Entities;
using Ewallet.Infrastructure.Identity;
using Ewallet.Mvc.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Mvc.Controllers;

public sealed record UserProfileResponse(
    long Id,
    string FullName,
    string UserName,
    string Email,
    string PhoneNumber,
    string Status,
    IList<string> Roles,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset? UpdatedAtUtc
);

public sealed record UpdateProfileRequest(
    [Required, StringLength(150, MinimumLength = 2)]
    string FullName,

    [Required, Phone, StringLength(20, MinimumLength = 8)]
    string PhoneNumber
);

public sealed record ChangePasswordRequest(
    [Required]
    string CurrentPassword,

    [Required, StringLength(100, MinimumLength = 8)]
    string NewPassword
);

[ApiController]
[Route("api/v1/profile")]
[Authorize]
public sealed class ProfileController(
    UserManager<AppUser> userManager,
    IAppDbContext db) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<UserProfileResponse>> GetProfile(CancellationToken ct)
    {
        var userId = User.GetRequiredUserId();
        var user = await userManager.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user is null)
            return NotFound(new { message = "Pengguna tidak ditemukan." });

        var roles = await userManager.GetRolesAsync(user);

        return Ok(new UserProfileResponse(
            user.Id,
            user.FullName,
            user.UserName!,
            user.Email!,
            user.PhoneNumber ?? string.Empty,
            user.Status.ToString(),
            roles,
            user.CreatedAtUtc,
            user.UpdatedAtUtc));
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request, CancellationToken ct)
    {
        var userId = User.GetRequiredUserId();
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return NotFound(new { message = "Pengguna tidak ditemukan." });

        var normalizedPhone = request.PhoneNumber.Trim();
        var phoneUsedByOther = await userManager.Users
            .AnyAsync(u => u.PhoneNumber == normalizedPhone && u.Id != userId, ct);

        if (phoneUsedByOther)
            return Conflict(new { message = "Nomor telepon sudah digunakan oleh akun lain." });

        user.FullName = request.FullName.Trim();
        user.PhoneNumber = normalizedPhone;
        user.UpdatedAtUtc = DateTimeOffset.UtcNow;

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            return BadRequest(new { errors = updateResult.Errors.Select(e => e.Description) });

        db.AuditLogs.Add(AuditLog.Create(
            action: "PROFILE_UPDATED",
            entityType: "AspNetUsers",
            entityId: user.Id.ToString(),
            outcome: OutcomeEnum.SUCCESS,
            description: "Pengguna memperbarui data profil.",
            actorUserId: user.Id,
            transactionId: null,
            correlationId: null,
            nowUtc: DateTime.UtcNow));

        await db.SaveChangesAsync(ct);

        var roles = await userManager.GetRolesAsync(user);
        return Ok(new UserProfileResponse(
            user.Id,
            user.FullName,
            user.UserName!,
            user.Email!,
            user.PhoneNumber!,
            user.Status.ToString(),
            roles,
            user.CreatedAtUtc,
            user.UpdatedAtUtc));
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request, CancellationToken ct)
    {
        var userId = User.GetRequiredUserId();
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return NotFound(new { message = "Pengguna tidak ditemukan." });

        var result = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        user.UpdatedAtUtc = DateTimeOffset.UtcNow;
        await userManager.UpdateAsync(user);

        db.AuditLogs.Add(AuditLog.Create(
            action: "PASSWORD_CHANGED",
            entityType: "AspNetUsers",
            entityId: user.Id.ToString(),
            outcome: OutcomeEnum.SUCCESS,
            description: "Pengguna mengubah password.",
            actorUserId: user.Id,
            transactionId: null,
            correlationId: null,
            nowUtc: DateTime.UtcNow));

        await db.SaveChangesAsync(ct);

        return Ok(new { message = "Password berhasil diperbarui." });
    }
}