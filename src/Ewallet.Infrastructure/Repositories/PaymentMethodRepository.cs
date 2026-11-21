using Ewallet.Infrastructure.Persistence;
using Ewallet.Application.DTOs;
using Ewallet.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Ewallet.Application.Repositories;

namespace Ewallet.Infrastructure.Repositories;

public sealed class PaymentMethodRepository(AppDbContext db) : IPaymentMethodRepository
{
    private readonly AppDbContext _db=db;

    public async Task<IReadOnlyList<PaymentMethodResponse>> GetActiveAsync(CancellationToken ct) => await _db.PaymentMethods.AsNoTracking().Where(pm=>pm.IsActive).OrderBy(pm=>pm.Id).Select(pm => new PaymentMethodResponse
    {
        Id =pm.Id,
        Code =pm.Code,
        Name =pm.Name,
        ProviderName=pm.ProviderName
    }).ToListAsync(ct);


    public Task<PaymentMethod?> GetByIdAsync(long id, CancellationToken ct) => _db.PaymentMethods.AsNoTracking().FirstOrDefaultAsync(pm=>pm.Id == id,ct);

} 
