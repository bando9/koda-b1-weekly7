using System.ComponentModel.DataAnnotations;

namespace Ewallet.Application.DTOs;

public sealed record CreateTopUpRequest
(
    [Required(ErrorMessage = "Wallet ID wajib diisi.")]
    long WalletId,
    [Required(ErrorMessage = "Payment Method Id wajib diisi.")]
    long PaymentMethodId,
    [Required(ErrorMessage = "Nonimal topup wajib diisi.")]
    [Range(typeof(decimal),"1", "1000000000000", ErrorMessage = "Angka minimal Rp.1, dan maksimal Rp.1T.")]
    decimal Amount
);


public sealed class TopUpResponse
{
    public long TopUpRequestId { get; init; }
    public long TransactionId { get; init; }
    public string ReferenceNo { get; init; } = string.Empty;
    public long WalletId { get; init; }
    public string PaymentMethodCode { get; init; } = string.Empty;
    public decimal Amount { get; init; }
    public string Status { get; init; } = string.Empty;            
    public string TransactionStatus { get; init; } = string.Empty; 
    public string? ProviderReference { get; init; }
    public DateTime CreatedAtUtc { get; init; }
    public DateTime? ExpiresAtUtc { get; init; }
    public DateTime? PaidAtUtc { get; init; }
}

