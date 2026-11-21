
using Ewallet.Application.DTOs;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.Repositories;


public interface IPaymentMethodRepository
{
    Task<IReadOnlyList<PaymentMethodResponse>> GetActiveAsync(CancellationToken ct);
    Task<PaymentMethod?> GetByIdAsync(long id, CancellationToken ct);
}