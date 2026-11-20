using Ewallet.Mvc.DTOs;
using Ewallet.Mvc.Models;

namespace Ewallet.Mvc.Repositories;

public interface IUserRepository
{
    Task<IReadOnlyList<User>> GetAllAsync(CancellationToken ct);

    Task<User?> GetByIdAsync(long id, CancellationToken ct);

    Task<long> CreateAsync(User user, CancellationToken ct);

    Task CreateWalletAsync(Wallet wallet, CancellationToken ct);

    Task<UserDetailResponse?> GetDetailByIdAsync(long id, CancellationToken ct);





    Task<User?> GetConflictUserAsync(string username,string email, string phone, CancellationToken ct);

};