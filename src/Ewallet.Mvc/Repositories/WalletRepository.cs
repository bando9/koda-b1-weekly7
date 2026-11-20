using Ewallet.Mvc.Data;
using Ewallet.Mvc.DTOs;
using Ewallet.Mvc.Models;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Mvc.Repositories;

public sealed class WalletRepository(AppDbContext db) : IWalletRepository
{
    private AppDbContext _db = db;


    public async Task<WalletResponse?> GetByIdAsync(long id, CancellationToken ct)
    {
        var wallet = await _db.Wallets.FirstOrDefaultAsync(w=>w.Id == id, ct);

        return wallet is null ? null : WalletResponse.FromModel(wallet);
    }

    public async Task<Wallet?> GetWalletByIdAsync(long id, CancellationToken ct) => await _db.Wallets.FirstOrDefaultAsync(w=>w.Id == id, ct);

    public Task<Wallet?> GetByWalletNumberAsync(string walletNumber, CancellationToken ct) => _db.Wallets.FirstOrDefaultAsync(w=>w.WalletNumber == walletNumber,ct);

    public Task<bool> ExistAsync(long id, CancellationToken ct) => _db.Wallets.AsNoTracking().AnyAsync(w=>w.Id == id, ct);

    public async Task<Wallet?> GetByUserId (long userId, CancellationToken ct) => await _db.Wallets.AsNoTracking().FirstOrDefaultAsync(w=>w.UserId == userId,ct);



    // public async Task
}