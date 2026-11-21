
using Ewallet.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Infrastructure.Persistence.Seeders;

public static class TransactionSeedData
{
    private const string MarkerReferenceNo = "TRX-TOPUP-20260110-001";

    public static void Seed(DbContext context)
    {
        if (context.Set<Transaction>().Any(t => t.ReferenceNo == MarkerReferenceNo)) return;

        var wallets = context.Set<Wallet>()
            .Include(w => w.User)
            .ToDictionary(w => w.User.Username);

        var methods = context.Set<PaymentMethod>()
            .ToDictionary(pm => pm.Code);

        var baseTime = new DateTime(2026, 1, 10, 8, 0, 0, DateTimeKind.Utc);

        ExecuteTopUp(context, wallets["andi.pratama"], methods["VA_BCA"],
            "TRX-TOPUP-20260110-001", 500_000m, TransactionStatusEnum.SUCCESS, "PROV-BCA-001", baseTime);

        ExecuteTopUp(context, wallets["budi.santoso"], methods["QRIS"],
            "TRX-TOPUP-20260110-002", 300_000m, TransactionStatusEnum.SUCCESS, "PROV-QRIS-002", baseTime.AddMinutes(15));

        ExecuteTopUp(context, wallets["citra.lestari"], methods["VA_MANDIRI"],
            "TRX-TOPUP-20260110-003", 1_000_000m, TransactionStatusEnum.SUCCESS, "PROV-MDR-003", baseTime.AddMinutes(30));

        ExecuteTopUp(context, wallets["dimas.wijaya"], methods["RETAIL_ALFA"],
            "TRX-TOPUP-20260110-004", 250_000m, TransactionStatusEnum.PENDING, "PROV-ALFA-004", baseTime.AddMinutes(45));

        ExecuteTopUp(context, wallets["eka.putri"], methods["QRIS"],
            "TRX-TOPUP-20260110-005", 150_000m, TransactionStatusEnum.FAILED, "PROV-QRIS-005", baseTime.AddHours(1));

        ExecuteTransfer(context, wallets["andi.pratama"], wallets["dimas.wijaya"],
            "TRX-TRF-20260110-001", 150_000m, TransactionStatusEnum.SUCCESS, "Patungan makan siang", baseTime.AddHours(2));

        ExecuteTransfer(context, wallets["citra.lestari"], wallets["eka.putri"],
            "TRX-TRF-20260110-002", 400_000m, TransactionStatusEnum.SUCCESS, "Bayar tiket konser", baseTime.AddHours(3));

        ExecuteTransfer(context, wallets["budi.santoso"], wallets["fajar.nugroho"],
            "TRX-TRF-20260110-003", 100_000m, TransactionStatusEnum.SUCCESS, "Cicilan barang", baseTime.AddHours(4));

        ExecuteTransfer(context, wallets["budi.santoso"], wallets["gita.permata"],
            "TRX-TRF-20260110-004", 500_000m, TransactionStatusEnum.FAILED, "Transfer gagal saldo kurang", baseTime.AddHours(5));
    }

    public static async Task SeedAsync(DbContext context, CancellationToken ct = default)
    {
        if (await context.Set<Transaction>().AnyAsync(t => t.ReferenceNo == MarkerReferenceNo, ct)) return;

        var wallets = await context.Set<Wallet>()
            .Include(w => w.User)
            .ToDictionaryAsync(w => w.User.Username, ct);

        var methods = await context.Set<PaymentMethod>()
            .ToDictionaryAsync(pm => pm.Code, ct);

        var baseTime = new DateTime(2026, 1, 10, 8, 0, 0, DateTimeKind.Utc);

        await ExecuteTopUpAsync(context, wallets["andi.pratama"], methods["VA_BCA"],
            "TRX-TOPUP-20260110-001", 500_000m, TransactionStatusEnum.SUCCESS, "PROV-BCA-001", baseTime, ct);

        await ExecuteTopUpAsync(context, wallets["budi.santoso"], methods["QRIS"],
            "TRX-TOPUP-20260110-002", 300_000m, TransactionStatusEnum.SUCCESS, "PROV-QRIS-002", baseTime.AddMinutes(15), ct);

        await ExecuteTopUpAsync(context, wallets["citra.lestari"], methods["VA_MANDIRI"],
            "TRX-TOPUP-20260110-003", 1_000_000m, TransactionStatusEnum.SUCCESS, "PROV-MDR-003", baseTime.AddMinutes(30), ct);

        await ExecuteTopUpAsync(context, wallets["dimas.wijaya"], methods["RETAIL_ALFA"],
            "TRX-TOPUP-20260110-004", 250_000m, TransactionStatusEnum.PENDING, "PROV-ALFA-004", baseTime.AddMinutes(45), ct);

        await ExecuteTopUpAsync(context, wallets["eka.putri"], methods["QRIS"],
            "TRX-TOPUP-20260110-005", 150_000m, TransactionStatusEnum.FAILED, "PROV-QRIS-005", baseTime.AddHours(1), ct);

        await ExecuteTransferAsync(context, wallets["andi.pratama"], wallets["dimas.wijaya"],
            "TRX-TRF-20260110-001", 150_000m, TransactionStatusEnum.SUCCESS, "Patungan makan siang", baseTime.AddHours(2), ct);

        await ExecuteTransferAsync(context, wallets["citra.lestari"], wallets["eka.putri"],
            "TRX-TRF-20260110-002", 400_000m, TransactionStatusEnum.SUCCESS, "Bayar tiket konser", baseTime.AddHours(3), ct);

        await ExecuteTransferAsync(context, wallets["budi.santoso"], wallets["fajar.nugroho"],
            "TRX-TRF-20260110-003", 100_000m, TransactionStatusEnum.SUCCESS, "Cicilan barang", baseTime.AddHours(4), ct);

        await ExecuteTransferAsync(context, wallets["budi.santoso"], wallets["gita.permata"],
            "TRX-TRF-20260110-004", 500_000m, TransactionStatusEnum.FAILED, "Transfer gagal saldo kurang", baseTime.AddHours(5), ct);
    }

    // *--- HELPER SYNC
    private static void ExecuteTopUp(
        DbContext context, Wallet targetWallet, PaymentMethod method,
        string refNo, decimal amount, TransactionStatusEnum status, string providerRef, DateTime createdAt)
    {
        DateTime? completedAt = status == TransactionStatusEnum.PENDING ? null : createdAt.AddMinutes(2);

        var trx = new Transaction(
            id: 0, referenceNo: refNo, type: TransactionTypeEnum.TOPUP, amount: amount, status: status,
            description: $"Top up via {method.Name}", createdAtUtc: createdAt, completedAtUtc: completedAt,
            senderWalletId: null, receiverWalletId: targetWallet.Id
        );
        context.Set<Transaction>().Add(trx);
        context.SaveChanges();

        var reqStatus = status switch
        {
            TransactionStatusEnum.SUCCESS => TopUpRequestStatusEnum.PAID,
            TransactionStatusEnum.FAILED => TopUpRequestStatusEnum.FAILED,
            _ => TopUpRequestStatusEnum.PENDING
        };

        var topUpReq = new TopUpRequest(
            id: 0, transactionId: trx.Id, walletId: targetWallet.Id, paymentMethodId: method.Id,
            amount: amount, status: reqStatus, providerReference: providerRef,
            createdAtUtc: createdAt, expiresAtUtc: createdAt.AddHours(24),
            paidAtUtc: status == TransactionStatusEnum.SUCCESS ? completedAt : null
        );
        context.Set<TopUpRequest>().Add(topUpReq);

        if (status == TransactionStatusEnum.SUCCESS)
        {
            decimal balanceBefore = targetWallet.Balance;
            targetWallet.Credit(amount, completedAt!.Value);

            var mutation = WalletMutation.CreateIn(
                trx.Id, targetWallet.Id, amount, balanceBefore, targetWallet.Balance, completedAt.Value);
            context.Set<WalletMutation>().Add(mutation);
        }

        var outcome = status == TransactionStatusEnum.FAILED ? OutcomeEnum.FAILED : OutcomeEnum.SUCCESS;
        context.Set<AuditLog>().Add(new AuditLog(
            0, "TOPUP_SEED", "Transaction", trx.Id.ToString(), outcome,
            $"TopUp {refNo} ({status})", refNo, completedAt ?? createdAt, targetWallet.UserId, trx.Id));

        context.SaveChanges();
    }

    private static void ExecuteTransfer(
        DbContext context, Wallet sender, Wallet receiver,
        string refNo, decimal amount, TransactionStatusEnum status, string description, DateTime createdAt)
    {
        DateTime? completedAt = status == TransactionStatusEnum.PENDING ? null : createdAt.AddSeconds(5);

        var trx = new Transaction(
            id: 0, referenceNo: refNo, type: TransactionTypeEnum.TRANSFER, amount: amount, status: status,
            description: description, createdAtUtc: createdAt, completedAtUtc: completedAt,
            senderWalletId: sender.Id, receiverWalletId: receiver.Id
        );
        context.Set<Transaction>().Add(trx);
        context.SaveChanges();

        if (status == TransactionStatusEnum.SUCCESS)
        {
            decimal senderBefore = sender.Balance;
            sender.Debit(amount, completedAt!.Value);
            context.Set<WalletMutation>().Add(
                WalletMutation.CreateOut(trx, sender.Id, amount, senderBefore, sender.Balance, completedAt.Value));

            decimal receiverBefore = receiver.Balance;
            receiver.Credit(amount, completedAt.Value);
            context.Set<WalletMutation>().Add(
                WalletMutation.CreateIn(trx.Id, receiver.Id, amount, receiverBefore, receiver.Balance, completedAt.Value));
        }

        var outcome = status == TransactionStatusEnum.FAILED ? OutcomeEnum.REJECTED : OutcomeEnum.SUCCESS;
        context.Set<AuditLog>().Add(new AuditLog(
            0, "TRANSFER_SEED", "Transaction", trx.Id.ToString(), outcome,
            $"Transfer {refNo} ({status})", refNo, completedAt ?? createdAt, sender.UserId, trx.Id));

        context.SaveChanges();
    }

    // --- HELPER ASYNC ---
    private static async Task ExecuteTopUpAsync(
        DbContext context, Wallet targetWallet, PaymentMethod method,
        string refNo, decimal amount, TransactionStatusEnum status, string providerRef, DateTime createdAt, CancellationToken ct)
    {
        DateTime? completedAt = status == TransactionStatusEnum.PENDING ? null : createdAt.AddMinutes(2);

        var trx = new Transaction(
            0, refNo, TransactionTypeEnum.TOPUP, amount, status,
            $"Top up via {method.Name}", createdAt, completedAt, null, targetWallet.Id
        );
        context.Set<Transaction>().Add(trx);
        await context.SaveChangesAsync(ct);

        var reqStatus = status switch
        {
            TransactionStatusEnum.SUCCESS => TopUpRequestStatusEnum.PAID,
            TransactionStatusEnum.FAILED => TopUpRequestStatusEnum.FAILED,
            _ => TopUpRequestStatusEnum.PENDING
        };

        context.Set<TopUpRequest>().Add(new TopUpRequest(
            0, trx.Id, targetWallet.Id, method.Id, amount, reqStatus, providerRef,
            createdAt, createdAt.AddHours(24), status == TransactionStatusEnum.SUCCESS ? completedAt : null
        ));

        if (status == TransactionStatusEnum.SUCCESS)
        {
            decimal balanceBefore = targetWallet.Balance;
            targetWallet.Credit(amount, completedAt!.Value);

            context.Set<WalletMutation>().Add(
                WalletMutation.CreateIn(trx.Id, targetWallet.Id, amount, balanceBefore, targetWallet.Balance, completedAt.Value));
        }

        var outcome = status == TransactionStatusEnum.FAILED ? OutcomeEnum.FAILED : OutcomeEnum.SUCCESS;
        context.Set<AuditLog>().Add(new AuditLog(
            0, "TOPUP_SEED", "Transaction", trx.Id.ToString(), outcome,
            $"TopUp {refNo} ({status})", refNo, completedAt ?? createdAt, targetWallet.UserId, trx.Id));

        await context.SaveChangesAsync(ct);
    }

    private static async Task ExecuteTransferAsync(
        DbContext context, Wallet sender, Wallet receiver,
        string refNo, decimal amount, TransactionStatusEnum status, string description, DateTime createdAt, CancellationToken ct)
    {
        DateTime? completedAt = status == TransactionStatusEnum.PENDING ? null : createdAt.AddSeconds(5);

        var trx = new Transaction(
            0, refNo, TransactionTypeEnum.TRANSFER, amount, status,
            description, createdAt, completedAt, sender.Id, receiver.Id
        );
        context.Set<Transaction>().Add(trx);
        await context.SaveChangesAsync(ct);

        if (status == TransactionStatusEnum.SUCCESS)
        {
            decimal senderBefore = sender.Balance;
            sender.Debit(amount, completedAt!.Value);
            context.Set<WalletMutation>().Add(
                WalletMutation.CreateOut(trx, sender.Id, amount, senderBefore, sender.Balance, completedAt.Value));

            decimal receiverBefore = receiver.Balance;
            receiver.Credit(amount, completedAt.Value);
            context.Set<WalletMutation>().Add(
                WalletMutation.CreateIn(trx.Id, receiver.Id, amount, receiverBefore, receiver.Balance, completedAt.Value));
        }

        var outcome = status == TransactionStatusEnum.FAILED ? OutcomeEnum.REJECTED : OutcomeEnum.SUCCESS;
        context.Set<AuditLog>().Add(new AuditLog(
            0, "TRANSFER_SEED", "Transaction", trx.Id.ToString(), outcome,
            $"Transfer {refNo} ({status})", refNo, completedAt ?? createdAt, sender.UserId, trx.Id));

        await context.SaveChangesAsync(ct);
    }

}
