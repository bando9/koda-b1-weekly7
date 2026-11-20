using Ewallet.Mvc.Data;
using Ewallet.Mvc.DTOs;
using Ewallet.Mvc.Models;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Mvc.Repositories;

public sealed class TopUpRepository(AppDbContext db) : ITopUpRepository
{
    private readonly AppDbContext _db=db;

    public async Task AddAsync(TopUpRequest request, CancellationToken ct) => await _db.TopUpRequests.AddAsync(request, ct);

    public Task<TopUpRequest?> GetByIdAsync(long id, CancellationToken ct) => _db.TopUpRequests.Include(t=>t.Transaction).Include(t=>t.Wallet).Include(t=>t.PaymentMethod).FirstOrDefaultAsync(t=>t.Id == id,ct);

    public async Task<TopUpResponse?> GetResponseByIdAsync(long id, CancellationToken ct)
    {
        var row = await _db.TopUpRequests
            .AsNoTracking()
            .Where(t=>t.Id == id) 
            .Select(t => new
            {
                t.Id,
                t.TransactionId,
                t.Transaction.ReferenceNo,
                t.WalletId,
                PaymentMethodCode = t.PaymentMethod.Code,
                t.Amount,
                t.Status,
                TransactionStatus=t.Transaction.Status,
                t.ProviderReference,
                t.CreatedAtUtc,
                t.ExpiresAtUtc,
                t.PaidAtUtc
            }).FirstOrDefaultAsync(ct);

        
        return row is null ? null : 
            new TopUpResponse
            {
                TopUpRequestId = row.Id,
                TransactionId = row.TransactionId,
                ReferenceNo = row.ReferenceNo,
                WalletId = row.WalletId,
                PaymentMethodCode = row.PaymentMethodCode,
                Amount = row.Amount,
                Status = row.Status.ToString(),
                TransactionStatus = row.TransactionStatus.ToString(),
                ProviderReference = row.ProviderReference,
                CreatedAtUtc = row.CreatedAtUtc,
                ExpiresAtUtc = row.ExpiresAtUtc,
                PaidAtUtc = row.PaidAtUtc
            };
    }
}