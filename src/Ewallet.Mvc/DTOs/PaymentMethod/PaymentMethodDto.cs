using Ewallet.Mvc.Models;

namespace Ewallet.Mvc.DTOs;

public sealed class PaymentMethodResponse
{
    public long Id { get; init; }
    public string Code { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? ProviderName { get; init; }
}
