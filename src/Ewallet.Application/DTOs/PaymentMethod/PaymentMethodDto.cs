using Ewallet.Domain.Entities;

namespace Ewallet.Application.DTOs;

public sealed class PaymentMethodResponse
{
    public long Id { get; init; }
    public string Code { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? ProviderName { get; init; }
}

