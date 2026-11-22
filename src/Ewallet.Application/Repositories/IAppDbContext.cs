using Ewallet.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Ewallet.Application.Repositories;

public interface IAppDbContext
{
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<PaymentMethod> PaymentMethods { get; }
    DbSet<TopUpRequest> TopUpRequests { get; }
    DbSet<Transaction> Transactions { get; }
    DbSet<Wallet> Wallets { get; }
    DbSet<WalletMutation> WalletMutations { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    DatabaseFacade Database { get; }

    ChangeTracker ChangeTracker { get; }
}