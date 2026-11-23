using Ewallet.Application.DTOs;

namespace Ewallet.Application.Services;

public interface IJwtTokenService
{
    IssuedAccessToken IssuedAccessToken(AuthUserResponse user);
}