using Ewallet.Application.DTOs;
using Ewallet.Application.Repositories;

namespace Ewallet.Application.Services;

public interface IPaymentMethodService
{
    Task<IReadOnlyList<PaymentMethodResponse>> GetActiveAsync(CancellationToken ct);
}

public sealed class PaymentMethodService(IPaymentMethodRepository repository) : IPaymentMethodService
{
    public async Task<IReadOnlyList<PaymentMethodResponse>> GetActiveAsync(CancellationToken ct) => await repository.GetActiveAsync(ct);
}
