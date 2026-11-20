using Ewallet.Mvc.Data;
using Ewallet.Mvc.DTOs;
using Ewallet.Mvc.Models;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Mvc.Repositories;

public interface IWalletMutationRepository
{
    Task AddAsync(WalletMutation mutation,CancellationToken ct);

    Task<PagedResult<MutationResponse>> GetHistoryAsync(long walletId, MutationQuery query,CancellationToken ct);
}

public sealed class WalletMutationRepository(AppDbContext db) : IWalletMutationRepository
{
    private readonly AppDbContext _db=db;
    public async Task AddAsync(WalletMutation mutation, CancellationToken ct) => await _db.WalletMutations.AddAsync(mutation,ct);


    public async Task<PagedResult<MutationResponse>> GetHistoryAsync(long walletId, MutationQuery query,CancellationToken ct)
    {
        IQueryable<WalletMutation> q = _db.WalletMutations
                                        .AsNoTracking()
                                        .Where(wm=>wm.WalletId == walletId);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim();
            q = q.Where(m => m.Transaction.ReferenceNo.Contains(search));
        }

        if (query.Direction.HasValue)
        {
            var direction = query.Direction.Value;
            q = q.Where(m=>m.Direction == direction); 
        }

        if (query.FromDate.HasValue)
        {
            var from = query.FromDate.Value.Date;
            q = q.Where(m=>m.CreatedAtUtc >= from);
        }

        if (query.ToDate.HasValue)
        {
            var toExclusive = query.ToDate.Value.Date.AddDays(1);
            q = q.Where(m=>m.CreatedAtUtc < toExclusive);
        }

        var totalCount = await q.CountAsync(ct);

        var desc = query.SortDir == SortDirection.Desc;
        IOrderedQueryable<WalletMutation> ordered=query.SortBy switch
        {
            MutationSortBy.Amount=>desc
                    ? q.OrderByDescending(m=>m.CreatedAtUtc)
                    : q.OrderBy(m=>m.CreatedAtUtc),
            _ => desc
                    ? q.OrderByDescending(m=>m.CreatedAtUtc)
                    : q.OrderBy(m=>m.CreatedAtUtc)
        };

        ordered = desc
                    ? ordered.ThenByDescending(m=>m.Id)
                    : ordered.ThenBy(m=>m.Id);

        var rows = await ordered
                    .Skip((query.Page - 1) * query.PageSize)
                    .Take(query.PageSize)
                    .Select(m=> new
                    {
                        m.Id,
                        m.TransactionId,
                        m.Transaction.ReferenceNo,
                        TransactionType = m.Transaction.Type,
                        m.Direction,
                        m.Amount,
                        m.BalanceBefore,
                        m.BalanceAfter,
                        m.CreatedAtUtc
                    })
                    .ToListAsync(ct);
        
        var items = rows
            .Select(r => new MutationResponse
            {
                Id = r.Id,
                TransactionId = r.TransactionId,
                ReferenceNo = r.ReferenceNo,
                TransactionType = r.TransactionType.ToString(),
                Direction = r.Direction.ToString(),
                Amount = r.Amount,
                BalanceBefore = r.BalanceBefore,
                BalanceAfter = r.BalanceAfter,
                CreatedAtUtc = r.CreatedAtUtc
            })
            .ToList();

        return PagedResult<MutationResponse>.Create(items, query.Page, query.PageSize, totalCount);


    }

}