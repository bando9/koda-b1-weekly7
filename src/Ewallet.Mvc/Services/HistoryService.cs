using Ewallet.Mvc.DTOs;
using Ewallet.Mvc.Repositories;

namespace Ewallet.Mvc.Services;

public interface IHistoryService
{
    Task<PagedResult<MutationResponse>?> GetMutationsAsync(long walletId, MutationQuery query, CancellationToken ct);
}

public sealed class HistoryService(
    IWalletRepository walletRepository,
    IWalletMutationRepository walletMutationRepository
) : IHistoryService
{
    public async Task<PagedResult<MutationResponse>?> GetMutationsAsync(long userId, MutationQuery query, CancellationToken ct)
    {
        var wallet = await walletRepository.GetByUserId(userId,ct) ?? throw new KeyNotFoundException($"Wallet dengan id {userId} tidak ditemukan");

        return await walletMutationRepository.GetHistoryAsync(wallet.Id,query,ct); 
    }
}