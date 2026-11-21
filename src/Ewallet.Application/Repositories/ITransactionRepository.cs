using Ewallet.Domain.Entities;

namespace Ewallet.Application.Repositories;

public interface ITransactionRepository
{
    Task AddAsync(Transaction transaction, CancellationToken ct);
}