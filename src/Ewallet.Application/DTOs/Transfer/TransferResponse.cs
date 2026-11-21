namespace Ewallet.Application.DTOs;

public sealed class TransferResponse
{
    public long TransactionId {get;init;}
    public string ReferenceNo {get;init;} = string.Empty;
    public long SenderWalletId {get;init;}
    public long ReceiverWalletId {get;init;}
    public string ReceiverWalletNumber {get;init;} = string.Empty;
    public decimal Amount {get;init;}
    public string Status {get;init;} =string.Empty;
    public string? Description {get;init;}
    public decimal SenderBalanceAfter {get;init;} 
    public DateTime CompletedAtUtc {get;init;} 
}
