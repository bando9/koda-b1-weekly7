
using System.Security.Cryptography;
using Ewallet.Mvc.Data;
using Ewallet.Mvc.DTOs;
using Ewallet.Mvc.Models;
using Ewallet.Mvc.Repositories;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace Ewallet.Mvc.Services;

public interface ITopUpService
{
    Task<TopUpResponse> CreateAsync(CreateTopUpRequest request, CancellationToken ct);
    Task<TopUpResponse> GetByIdAsync(long topUpRequestId, CancellationToken ct);
    Task<TopUpResponse> ConfirmAsync(long topUpRequestId, CancellationToken ct);
}

public sealed class TopUpService (
    AppDbContext db,
    IWalletRepository walletRepository,
    IPaymentMethodRepository paymentMethodRepository,
    ITopUpRepository topUpRepository,
    IWalletMutationRepository walletMutationRepository,
    IAuditLogRepository auditLogRepository,
    TimeProvider time

): ITopUpService
{
    private static readonly TimeSpan RequestLifeTime = TimeSpan.FromHours(24);
    
    public async Task<TopUpResponse> ConfirmAsync(long topUpRequestId, CancellationToken ct)
    {
        await using var dbTx = await db.Database.BeginTransactionAsync(ct);

        try
        {
            var topup = await topUpRepository.GetByIdAsync(topUpRequestId,ct) ?? throw new InvalidOperationException($"Topup dg id {topUpRequestId} tidak ditemukan");
            
            var transaction = topup.Transaction;
            var wallet = topup.Wallet;

            if(topup.Status != TopUpRequestStatusEnum.PENDING) throw new InvalidOperationException($"topup sudah berstatus {topup.Status}, tidak dapat diproses ulang");

            if(transaction.Type != TransactionTypeEnum.TOPUP 
                || transaction.Status != TransactionStatusEnum.PENDING
                || transaction.ReceiverWalletId != topup.WalletId
                || transaction.Amount != topup.Amount) 
                throw new InvalidOperationException("data topup tidak konsisten dg transaksinya");

            var now = time.GetUtcNow().UtcDateTime;

            var balanceBefore = wallet.Balance;
            wallet.Credit(topup.Amount, now);
            topup.MarkPaid(now);
            transaction.MarkSuccess(now);

            await walletMutationRepository.AddAsync(WalletMutation.CreateIn(
                transactionId: transaction.Id,
                walletId: wallet.Id,
                amount: topup.Amount,
                balanceBefore: balanceBefore,
                balanceAfter: wallet.Balance,
                nowUtc: now), ct);

            var correlationId = Activity.Current?.TraceId.ToString() 
                    ?? Guid.NewGuid().ToString("N");

            await auditLogRepository.AddAsync(AuditLog.Create(
                action: "TOPUP_PAID", 
                entityType: "Transaction",
                entityId: transaction.Id.ToString(),
                outcome: OutcomeEnum.SUCCESS,
                description: "Pembayaran simulasi dikonfirmasi.",
                actorUserId: wallet.UserId,
                transactionId: transaction.Id,
                correlationId: correlationId,
                nowUtc: now), ct);

            await db.SaveChangesAsync(ct);
            await dbTx.CommitAsync(ct);

            return Map(topup,transaction,topup.PaymentMethod.Code);            
            
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new InvalidOperationException(
                "Data wallet berubah saat diproses (konflik concurrency). Silakan coba lagi.");
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        {
            throw new InvalidOperationException("Top up ini sedang atau sudah diproses.");
        }
    }

    public async Task<TopUpResponse> CreateAsync(CreateTopUpRequest request, CancellationToken ct)
    {
        var wallet = await walletRepository.GetByIdAsync(request.WalletId,ct) ?? throw new InvalidOperationException("wallet tidak ditemukan");

        WalletStatusEnum active = WalletStatusEnum.ACTIVE;
        if (wallet.Status != active)
        {
            throw new InvalidOperationException("wallet tidak berstatus ACTIVE");
        }

        var method = await paymentMethodRepository.GetByIdAsync(request.PaymentMethodId,ct) ?? throw new InvalidOperationException("Metode pembayaran blm tersedia");
        if(!method.IsActive) throw new InvalidOperationException("metode pembayaran tidak aktif");

        var now = time.GetUtcNow().UtcDateTime;

        var transaction = Transaction.CreateTopUp(
          referenceNo: GenerateNumberRange(8),
          receiverWalletId: wallet.Id,
          amount: request.Amount,
          description: $"Top up via {method.Name}",
          nowUtc: now        
        );

        var topUp = TopUpRequest.Create(
            transaction:transaction,
            walletId:wallet.Id,
            paymentMethodId: method.Id, 
            amount: request.Amount,
            providerReference: $"SIM-{method.Code}-{GenerateNumberRange(12)}",
            nowUtc:now,
            expiresAtUtc:now.Add(RequestLifeTime)
        );

        await using var dbTx=await db.Database.BeginTransactionAsync(ct);
        await topUpRepository.AddAsync(topUp,ct);
        await db.SaveChangesAsync(ct);

        await auditLogRepository.AddAsync(AuditLog.Create(
            action: "TOPUP_REQUESTED",
            entityType: "Transaction",
            entityId: transaction.Id.ToString(),
            outcome: OutcomeEnum.SUCCESS,
            description: "Permintaan top up dibuat.",
            actorUserId: wallet.UserId,
            transactionId: transaction.Id,
            correlationId: "tes correlationId",
            nowUtc: now), ct);
        
        await db.SaveChangesAsync(ct);

        await dbTx.CommitAsync(ct);

        return Map(topUp,transaction,method.Code);

    }

    public async Task<TopUpResponse> GetByIdAsync(long topUpRequestId, CancellationToken ct) => await topUpRepository.GetResponseByIdAsync(topUpRequestId, ct) ?? throw new ArgumentException($"topup dg id: {topUpRequestId} tidak ditemukan");

    private static string GenerateNumberRange(int length)
    {
        return string.Concat(Enumerable.Range(0, length)
            .Select(_ => RandomNumberGenerator.GetInt32(0, length)));
    }


    private static TopUpResponse Map(TopUpRequest topUp, Transaction transaction, string paymentMethodCode)
        => new()
        {
            TopUpRequestId = topUp.Id,
            TransactionId = transaction.Id,
            ReferenceNo = transaction.ReferenceNo,
            WalletId = topUp.WalletId,
            PaymentMethodCode = paymentMethodCode,
            Amount = topUp.Amount,
            Status = topUp.Status.ToString(),
            TransactionStatus = transaction.Status.ToString(),
            ProviderReference = topUp.ProviderReference,
            CreatedAtUtc = topUp.CreatedAtUtc,
            ExpiresAtUtc = topUp.ExpiresAtUtc,
            PaidAtUtc = topUp.PaidAtUtc
        };
}
