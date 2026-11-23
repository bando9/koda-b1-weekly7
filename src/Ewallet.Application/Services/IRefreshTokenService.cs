using Ewallet.Application.DTOs;

namespace Ewallet.Application.Services;

public interface IRefreshTokenService
{
    Task<RefreshTokenSessionResult> CreateSessionAsync (AuthUserResponse user, CancellationToken ct);

    Task<RefreshTokenSessionResult> RotateAsync (string rawRefreshToken, CancellationToken ct = default);
    Task RevokeFamilyAsync (string rawRefreshToken, CancellationToken ct = default);
}