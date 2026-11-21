namespace Ewallet.Application.DTOs;

public sealed class MutationResponse
{
    public long Id {get;set;}
    public long TransactionId {get;set;}
    public string ReferenceNo {get;set;}=string.Empty;
    public string TransactionType {get;set;}=string.Empty;
    public string Direction {get;set;}=string.Empty;
    public decimal Amount {get;set;}
    public decimal BalanceBefore {get;set;}
    public decimal BalanceAfter {get;set;}
    public DateTime CreatedAtUtc {get;init;}

}
