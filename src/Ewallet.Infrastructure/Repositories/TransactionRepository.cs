using Transaction = Ewallet.Domain.Entities.Transaction;
using Ewallet.Infrastructure.Persistence;
using Ewallet.Application.Repositories;


namespace Ewallet.Infrastructure.Repositories;

public sealed class TransactionRepository(AppDbContext db) : ITransactionRepository
{
    private readonly AppDbContext _db=db;
    public async Task AddAsync(Transaction transaction, CancellationToken ct) => await _db.Transactions.AddAsync(transaction,ct);
}
