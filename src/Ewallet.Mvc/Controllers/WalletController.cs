using Ewallet.Application.DTOs;
using Ewallet.Application.Repositories;
using Ewallet.Application.Services;
using Ewallet.Domain.Entities;
using Ewallet.Mvc.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Mvc.Controllers;

[ApiController]
[Route("api/v1/wallets")]
[Authorize]

public sealed class WalletController(
    IWalletRepository walletRepository,
    IHistoryService historyService,
    IAppDbContext db
) : ControllerBase
{
    [HttpGet("me")]
    public async Task<IActionResult> GetMyWallet(CancellationToken ct)
    {
        var userId = User.GetRequiredUserId();
        var wallet = await walletRepository.GetByUserId(userId, ct);

        if (wallet is null)
            return NotFound(new { message = "Wallet tidak ditemukan." });

        return Ok(new
        {
            wallet.Id,
            wallet.WalletNumber,
            wallet.Balance,
            Status = wallet.Status.ToString(),
            wallet.CreatedAtUtc,
            wallet.UpdatedAtUtc
        });
    }

    [HttpGet("me/mutations")]
    [ProducesResponseType(typeof(PagedResult<MutationResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyMutations([FromQuery] MutationQuery query, CancellationToken ct)
    {
        try
        {
            var userId = User.GetRequiredUserId();
            var result = await historyService.GetMutationsAsync(userId, query, ct);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("me/transactions")]
    public async Task<IActionResult> GetMyTransactions(
        [FromQuery] string? search,
    [FromQuery] string? type,
    [FromQuery] string? status,
    [FromQuery] int? days,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10,
    CancellationToken ct = default)
    {
        var userId = User.GetRequiredUserId();
        var wallet = await walletRepository.GetByUserId(userId, ct);
        if (wallet is null)
            return NotFound(new { message = "Wallet tidak ditemukan." });

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);

        var query = db.Transactions
            .AsNoTracking()
            .Where(t => t.SenderWalletId == wallet.Id || t.ReceiverWalletId == wallet.Id);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(t =>
                t.ReferenceNo.Contains(term) ||
                (t.Description != null && t.Description.Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(type) &&
            Enum.TryParse<TransactionTypeEnum>(type.Trim(), ignoreCase: true, out var parsedType))
        {
            query = query.Where(t => t.Type == parsedType);
        }

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<TransactionStatusEnum>(status.Trim(), ignoreCase: true, out var parsedStatus))
        {
            query = query.Where(t => t.Status == parsedStatus);
        }

        if (days is > 0)
        {
            var cutoffUtc = DateTime.UtcNow.AddDays(-days.Value);
            query = query.Where(t => t.CreatedAtUtc >= cutoffUtc);
        }

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(t => t.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new
            {
                t.Id,
                t.ReferenceNo,
                Type = t.Type.ToString(),
                Status = t.Status.ToString(),
                Direction = t.SenderWalletId == wallet.Id ? "OUT" : "IN",
                t.Amount,
                t.Description,
                t.CreatedAtUtc,
                t.CompletedAtUtc
            })
            .ToListAsync(ct);

        return Ok(new { items, page, pageSize, totalCount });
    }


    [HttpGet("me/transactions/{transactionId:long}")]
    public async Task<IActionResult> GetMyTransactionDetail(long transactionId, CancellationToken ct)
    {
        var userId = User.GetRequiredUserId();
        var wallet = await walletRepository.GetByUserId(userId, ct);
        if (wallet is null)
            return NotFound(new { message = "Wallet tidak ditemukan." });

        var tx = await db.Transactions
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == transactionId, ct);

        if (tx is null)
            return NotFound(new { message = "Transaksi tidak ditemukan." });

        if (tx.SenderWalletId != wallet.Id && tx.ReceiverWalletId != wallet.Id)
            return Forbid();

        return Ok(new
        {
            tx.Id,
            tx.ReferenceNo,
            Type = tx.Type.ToString(),
            Status = tx.Status.ToString(),
            Direction = tx.SenderWalletId == wallet.Id ? "OUT" : "IN",
            tx.SenderWalletId,
            tx.ReceiverWalletId,
            tx.Amount,
            tx.Description,
            tx.CreatedAtUtc,
            tx.CompletedAtUtc
        });
    }
}