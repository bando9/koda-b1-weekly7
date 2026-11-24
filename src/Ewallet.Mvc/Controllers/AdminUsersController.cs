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

public sealed record UpdateUserStatusRequest(
    [Required] UserStatusEnum Status
);

public sealed record UpdateUserRoleRequest(
    [Required] string Role 
);

[ApiController]
[Route("api/v1/admin/users")]
[Authorize(Roles = "ADMIN")]
public sealed class AdminUsersController(
    UserManager<AppUser> userManager,
    RoleManager<IdentityRole<long>> roleManager,
    IAppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetUsers(
        [FromQuery] string? search,
        [FromQuery] UserStatusEnum? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);

        var query = userManager.Users.AsNoTracking();

        if (status.HasValue)
        {
            query = query.Where(u => u.Status == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(u =>
                u.FullName.Contains(term) ||
                u.UserName!.Contains(term) ||
                u.Email!.Contains(term) ||
                u.PhoneNumber!.Contains(term));
        }

        var totalCount = await query.CountAsync(ct);
        var users = await query
            .OrderByDescending(u => u.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var userIds = users.Select(u => u.Id).ToList();
        var wallets = await db.Wallets
            .AsNoTracking()
            .Where(w => userIds.Contains(w.UserId))
            .ToDictionaryAsync(w => w.UserId, ct);

        var items = new List<object>();
        foreach (var u in users)
        {
            var roles = await userManager.GetRolesAsync(u);
            wallets.TryGetValue(u.Id, out var wallet);

            items.Add(new
            {
                u.Id,
                u.FullName,
                u.UserName,
                u.Email,
                u.PhoneNumber,
                Status = u.Status.ToString(),
                Roles = roles,
                Wallet = wallet is null ? null : new
                {
                    wallet.Id,
                    wallet.WalletNumber,
                    wallet.Balance,
                    Status = wallet.Status.ToString()
                },
                u.CreatedAtUtc
            });
        }

        return Ok(new { items, page, pageSize, totalCount });
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetUserById(long id, CancellationToken ct)
    {
        var user = await userManager.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id, ct);
        if (user is null)
            return NotFound(new { message = "User tidak ditemukan." });

        var roles = await userManager.GetRolesAsync(user);
        var wallet = await db.Wallets.AsNoTracking().FirstOrDefaultAsync(w => w.UserId == id, ct);

        return Ok(new
        {
            user.Id,
            user.FullName,
            user.UserName,
            user.Email,
            user.PhoneNumber,
            Status = user.Status.ToString(),
            Roles = roles,
            Wallet = wallet is null ? null : new
            {
                wallet.Id,
                wallet.WalletNumber,
                wallet.Balance,
                Status = wallet.Status.ToString()
            },
            user.CreatedAtUtc,
            user.UpdatedAtUtc
        });
    }

    [HttpPatch("{id:long}/status")]
    public async Task<IActionResult> UpdateUserStatus(long id, [FromBody] UpdateUserStatusRequest request, CancellationToken ct)
    {
        var adminId = User.GetRequiredUserId();
        if (adminId == id)
            return BadRequest(new { message = "Admin tidak dapat mengubah status akunnya sendiri." });

        var user = await userManager.FindByIdAsync(id.ToString());
        if (user is null)
            return NotFound(new { message = "User tidak ditemukan." });

        user.Status = request.Status;
        user.UpdatedAtUtc = DateTimeOffset.UtcNow;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        db.AuditLogs.Add(AuditLog.Create(
            action: "ADMIN_USER_STATUS_UPDATED",
            entityType: "AspNetUsers",
            entityId: user.Id.ToString(),
            outcome: OutcomeEnum.SUCCESS,
            description: $"Status user diubah menjadi {request.Status}.",
            actorUserId: adminId,
            transactionId: null,
            correlationId: null,
            nowUtc: DateTime.UtcNow));

        await db.SaveChangesAsync(ct);

        return Ok(new { user.Id, Status = user.Status.ToString() });
    }

    [HttpPut("{id:long}/role")]
    public async Task<IActionResult> UpdateUserRole(long id, [FromBody] UpdateUserRoleRequest request, CancellationToken ct)
    {
        var adminId = User.GetRequiredUserId();
        if (adminId == id)
            return BadRequest(new { message = "Admin tidak dapat mengubah role akunnya sendiri." });

        var roleName = request.Role.Trim().ToUpperInvariant();
        if (!await roleManager.RoleExistsAsync(roleName))
            return BadRequest(new { message = $"Role '{roleName}' tidak tersedia." });

        var user = await userManager.FindByIdAsync(id.ToString());
        if (user is null)
            return NotFound(new { message = "User tidak ditemukan." });

        var currentRoles = await userManager.GetRolesAsync(user);
        await userManager.RemoveFromRolesAsync(user, currentRoles);
        var addResult = await userManager.AddToRoleAsync(user, roleName);

        if (!addResult.Succeeded)
            return BadRequest(new { errors = addResult.Errors.Select(e => e.Description) });

        db.AuditLogs.Add(AuditLog.Create(
            action: "ADMIN_USER_ROLE_UPDATED",
            entityType: "AspNetUsers",
            entityId: user.Id.ToString(),
            outcome: OutcomeEnum.SUCCESS,
            description: $"Role user diubah menjadi {roleName}.",
            actorUserId: adminId,
            transactionId: null,
            correlationId: null,
            nowUtc: DateTime.UtcNow));

        await db.SaveChangesAsync(ct);

        return Ok(new { user.Id, Role = roleName });
    }


    [HttpGet("summary")]
    public async Task<IActionResult> GetUsersSummary(CancellationToken ct)
    {
        var nowUtc = DateTimeOffset.UtcNow;
        var startOfMonthUtc = new DateTimeOffset(nowUtc.Year, nowUtc.Month, 1, 0, 0, 0, TimeSpan.Zero);

        var totalUsers = await userManager.Users.CountAsync(ct);
        var activeUsers = await userManager.Users.CountAsync(u => u.Status == UserStatusEnum.ACTIVE, ct);
        var suspendedUsers = await userManager.Users.CountAsync(u => u.Status == UserStatusEnum.SUSPENDED, ct);
        var newUsersThisMonth = await userManager.Users.CountAsync(u => u.CreatedAtUtc >= startOfMonthUtc, ct);

        return Ok(new
        {
            totalUsers,
            activeUsers,
            suspendedUsers,
            newUsersThisMonth
        });
    }
}