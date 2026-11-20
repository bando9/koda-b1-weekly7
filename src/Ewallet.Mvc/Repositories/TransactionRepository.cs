using Transaction = Ewallet.Mvc.Models.Transaction;
using Ewallet.Mvc.Data;


namespace Ewallet.Mvc.Repositories;

public interface ITransactionRepository
{
    Task AddAsync(Transaction transaction, CancellationToken ct);
}

public sealed class TransactionRepository(AppDbContext db) : ITransactionRepository
{
    private readonly AppDbContext _db=db;
    public async Task AddAsync(Transaction transaction, CancellationToken ct) => await _db.Transactions.AddAsync(transaction,ct);
}