using System.Security.Cryptography;
using System.Text;
using Ewallet.Application.DTOs;
using Ewallet.Application.Services;
using Ewallet.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Infrastructure.Identity;

public sealed class RefreshTokenService(
    AppDbContext db,
    UserManager<AppUser> userManager,
    IJwtTokenService jwtTokenService
) : IRefreshTokenService
{
    private static readonly TimeSpan RefreshLifeTime = TimeSpan.FromDays(7);

    public async Task<RefreshTokenSessionResult> CreateSessionAsync(AuthUserResponse user, CancellationToken ct)
    {
        var now = DateTimeOffset.UtcNow;
        var rawToken = GenerateToken();
        var expiredAt = now.Add(RefreshLifeTime);

        var accessToken = jwtTokenService.IssuedAccessToken(user);
        var tokenEntity = CreateTokenEntity(user.Id, Guid.NewGuid(), HashToken(rawToken), now, expiredAt);

        db.RefreshToken.Add(tokenEntity);
        await db.SaveChangesAsync(ct);
        return new RefreshTokenSessionResult(user,accessToken,rawToken,expiredAt);
    }

    public async Task RevokeFamilyAsync(string rawRefreshToken, CancellationToken ct = default)
    {
        var hash = HashToken(rawRefreshToken);
        var token = await db.RefreshToken.AsNoTracking().SingleOrDefaultAsync(t=>t.TokenHash == hash, ct);

        if(token is not null)
        {
            await RevokeFamilyByIdAsync(token.FamilyId,ct);
        }
    }

    public async Task<RefreshTokenSessionResult> RotateAsync(string rawRefreshToken, CancellationToken ct = default)
    {
        var hash = HashToken(rawRefreshToken);
        var now = DateTimeOffset.UtcNow;

        var currentToken = await db.RefreshToken.AsNoTracking().SingleOrDefaultAsync(t=>t.TokenHash == hash,ct);

        if(currentToken is null) return null!;
        if(currentToken.UsedAtUtc is not null)
        {
            await RevokeFamilyByIdAsync(currentToken.FamilyId,ct);
            return null!;
        }

        if(currentToken.RevokedAtUtc is not null || currentToken.ExpiredAtUtc <= now)
        {
            return null!;
        }

        var identityUser = await userManager.FindByIdAsync(currentToken.UserId.ToString("D"));

        if(identityUser is null || string.IsNullOrWhiteSpace(identityUser.Email))
        {
            return null!;
        }

        var roles = await userManager.GetRolesAsync(identityUser);
        var primaryRole = roles.FirstOrDefault() ?? "CUSTOMER";
        var wallet = await db.Wallets
                    .AsNoTracking()
                    .FirstOrDefaultAsync(w => w.UserId == identityUser.Id, ct);

        var user = new AuthUserResponse(
            Id: identityUser.Id,
            FullName: identityUser.FullName,
            UserName: identityUser.UserName ?? string.Empty,
            Email: identityUser.Email,
            PhoneNumber: identityUser.PhoneNumber ?? string.Empty,
            Role: primaryRole,
            WalletId: wallet?.Id ?? 0,
            Balance: wallet?.Balance ?? 0m
        );

        var nextRawToken = GenerateToken();
        var nextExpiresAt = now.Add(RefreshLifeTime);
        var nextAccessToken = jwtTokenService.IssuedAccessToken(user);

        await using var transaction = await db.Database.BeginTransactionAsync(ct);

        var affectedRows = await db.RefreshToken.Where(t=> t.Id == currentToken.Id && t.UsedAtUtc == null && t.RevokedAtUtc ==null && t.ExpiredAtUtc>now).ExecuteUpdateAsync(s=>s.SetProperty(t=>t.UsedAtUtc,(DateTimeOffset?)now),ct);

        if(affectedRows != 1)
        {
            await transaction.RollbackAsync(ct);
            return null!;
        }

        var newTokenEntity = CreateTokenEntity(
            currentToken.UserId,
            currentToken.FamilyId,
            HashToken(nextRawToken),
            now,
            nextExpiresAt            
        );

        db.RefreshToken.Add(newTokenEntity);
        await db.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);


        return new RefreshTokenSessionResult(user,nextAccessToken,nextRawToken,nextExpiresAt);
    }


    private Task RevokeFamilyByIdAsync(Guid familyId, CancellationToken ct)
    {
        var now = DateTimeOffset.UtcNow;
        return db.RefreshToken.Where(t=>t.FamilyId == familyId && t.RevokedAtUtc == null).ExecuteUpdateAsync(s => s.SetProperty(t=>t.RevokedAtUtc,(DateTimeOffset?) now),ct);
    } 

    private static RefreshToken CreateTokenEntity(
        long userId,
        Guid familyId,
        string tokenHash,
        DateTimeOffset now,
        DateTimeOffset expiredAt
    ) => new()
    {
        Id = Guid.NewGuid(),
        UserId = userId,
        FamilyId = familyId,
        TokenHash=tokenHash,
        CreatedAtUtc=now,
        ExpiredAtUtc=expiredAt
    };

    private static string GenerateToken() => Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
    private static string HashToken(string rawToken) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(rawToken)));
}