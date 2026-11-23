namespace Ewallet.Application.DTOs;

public sealed record RefreshTokenSessionResult
(
    AuthUserResponse User,
    IssuedAccessToken AccessToken,
    string RawRefreshToken,
    DateTimeOffset RefreshExpiredAtUtc
);