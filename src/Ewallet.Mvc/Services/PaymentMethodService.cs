using Ewallet.Mvc.Data;
using Ewallet.Mvc.DTOs;
using Ewallet.Mvc.Repositories;

namespace Ewallet.Mvc.Services;

public interface IPaymentMethodService
{
    Task<IReadOnlyList<PaymentMethodResponse>> GetActiveAsync(CancellationToken ct);
}

public sealed class PaymentMethodService(IPaymentMethodRepository repository) : IPaymentMethodService
{
    public async Task<IReadOnlyList<PaymentMethodResponse>> GetActiveAsync(CancellationToken ct) => await repository.GetActiveAsync(ct);
}