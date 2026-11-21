
using Ewallet.Application.DTOs;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.Repositories;

public interface IWalletMutationRepository
{
    Task AddAsync(WalletMutation mutation,CancellationToken ct);

    Task<PagedResult<MutationResponse>> GetHistoryAsync(long walletId, MutationQuery query,CancellationToken ct);
}