using Ewallet.Mvc.DTOs;

namespace Ewallet.Mvc.Services;

public interface IUserService
{
    Task<IReadOnlyList<UserResponse>> GetAllAsync(CancellationToken ct);

    Task<UserResponse?> GetByIdAsync(long id, CancellationToken ct);

    Task<UserDetailResponse?> GetDetailByIdAsync(long id, CancellationToken ct);
    
    
    Task<UserResponse?> CreateWithWalletAsync(UserRequest request,CancellationToken ct);


}