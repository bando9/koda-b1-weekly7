using Ewallet.Mvc.DTOs;
using Ewallet.Mvc.Models;

namespace Ewallet.Mvc.Repositories;

public interface IWalletRepository
{
    Task<WalletResponse?> GetByIdAsync(long id, CancellationToken ct);
    Task<Wallet?> GetWalletByIdAsync(long id, CancellationToken ct);

    Task<Wallet?> GetByWalletNumberAsync (string walletNumber, CancellationToken ct);

    Task<bool> ExistAsync(long id,CancellationToken ct);

    Task<Wallet?> GetByUserId (long userId, CancellationToken ct);


}