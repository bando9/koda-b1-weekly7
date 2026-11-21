using Ewallet.Application.DTOs;

namespace Ewallet.Application.Services;

public interface IUserService
{
    Task<IReadOnlyList<UserResponse>> GetAllAsync(CancellationToken ct);

    Task<UserResponse?> GetByIdAsync(long id, CancellationToken ct);

    Task<UserDetailResponse?> GetDetailByIdAsync(long id, CancellationToken ct);
    
    
    Task<UserResponse?> CreateWithWalletAsync(UserRequest request,CancellationToken ct);


}
