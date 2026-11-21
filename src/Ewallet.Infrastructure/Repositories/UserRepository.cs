using Ewallet.Infrastructure.Persistence;
using Ewallet.Application.DTOs;
using Ewallet.Domain.Entities;
using Ewallet.Application.Repositories;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Application.Repositories;

public sealed class UserRepository(AppDbContext db) : IUserRepository
{
    private readonly AppDbContext _db = db;

    public async Task<IReadOnlyList<User>> GetAllAsync(CancellationToken ct)
    {
        return await _db.Users.AsNoTracking().ToListAsync(ct);
    }

    public async Task<User?> GetByIdAsync(long id, CancellationToken ct)
    {
        return await _db.Users.AsNoTracking().FirstOrDefaultAsync(u=>u.Id == id,ct);
    }

    public async Task<UserDetailResponse?> GetDetailByIdAsync(long id, CancellationToken ct)
    {
        var user = await _db.Users.AsNoTracking().Include(u => u.Wallet).FirstOrDefaultAsync(u=>u.Id == id,ct);

        return user is null ? null : UserDetailResponse.FromModel(user);
    }

    public async Task<long> CreateAsync(User user, CancellationToken ct){
        await _db.Users.AddAsync(user,ct);
        await _db.SaveChangesAsync(ct);
        return user.Id;        
    }

    public async Task CreateWalletAsync(Wallet wallet, CancellationToken ct)
    {
        await _db.Wallets.AddAsync(wallet, ct);
        await _db.SaveChangesAsync(ct);

    }

    public async Task<User?> GetConflictUserAsync(string username,string email, string phone, CancellationToken ct)
    {
        return await _db.Users.AsNoTracking().FirstOrDefaultAsync(u=>u.Username == username || u.Email == email || u.Phone == phone,ct);
    }

    
}
