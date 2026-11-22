using Ewallet.Application.DTOs;

namespace Ewallet.Application.Services;

public interface IAuthService
{
    Task<RegisterResult> RegisterAsync(RegisterRequest request, CancellationToken ct);
    Task<LoginResult> LoginAsync(LoginRequest request, CancellationToken ct);
}