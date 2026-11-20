namespace Ewallet.Mvc.Models;


public enum TopUpRequestStatusEnum{
    PENDING, 
    PAID, 
    FAILED, 
    EXPIRED
}


public sealed class TopUpRequest
{
    private TopUpRequest() { } 


    public long Id	{get; private set;}
    public decimal Amount {get; private set;}
    public TopUpRequestStatusEnum Status {get; private set;}
    public string? ProviderReference	{get; private set;}
    public DateTime CreatedAtUtc	{get; private set;}
    public DateTime? ExpiresAtUtc	{get; private set;}
    public DateTime? PaidAtUtc	{get; private set;} 

    // Foreign Key 
    public long TransactionId	{get; private set;}
    public Transaction Transaction	{get; private set;} = null!;
    public long WalletId {get; private set;}
    public Wallet Wallet {get; private set;} = null!;
    public int PaymentMethodId {get; private set;}
    public PaymentMethod PaymentMethod {get; private set;} = null!; 

    public TopUpRequest(long id, decimal amount, TopUpRequestStatusEnum status, string? providerReference, DateTime createdAtUtc, DateTime? expiresAtUtc, DateTime? paidAtUtc)
    {
        Id=id;
        Amount=amount;
        Status = status;
        ProviderReference=providerReference;
        CreatedAtUtc=createdAtUtc;
        ExpiresAtUtc=expiresAtUtc;
        PaidAtUtc=paidAtUtc;
    }

    public TopUpRequest(
        long id, long transactionId, long walletId, int paymentMethodId,
        decimal amount, TopUpRequestStatusEnum status, string? providerReference,
        DateTime createdAtUtc, DateTime? expiresAtUtc, DateTime? paidAtUtc)
    {
        Id = id;
        TransactionId = transactionId;
        WalletId = walletId;
        PaymentMethodId = paymentMethodId;
        Amount = amount;
        Status = status;
        ProviderReference = providerReference;
        CreatedAtUtc = createdAtUtc;
        ExpiresAtUtc = expiresAtUtc;
        PaidAtUtc = paidAtUtc;
    }

    public static TopUpRequest Create(
        Transaction transaction,long walletId,int paymentMethodId,decimal amount,string? providerReference, DateTime nowUtc,DateTime expiresAtUtc
    ){
        if(amount <= 0) throw new ArgumentException("nominal harus lebih dari 0");

        return new TopUpRequest
        {
            Transaction = transaction,
            WalletId = walletId,
            PaymentMethodId = paymentMethodId,
            Amount = amount,
            Status = TopUpRequestStatusEnum.PENDING,
            ProviderReference=providerReference,
            CreatedAtUtc=nowUtc,
            ExpiresAtUtc=expiresAtUtc,
            PaidAtUtc=null
        };
    }

    public void MarkPaid(DateTime nowUtc)
    {
        EnsurePending();
        Status = TopUpRequestStatusEnum.PAID;
        PaidAtUtc=nowUtc;
    }

    public void MarkExpired()
    {
        EnsurePending();
        Status = TopUpRequestStatusEnum.EXPIRED;
    }




    private void EnsurePending()
    {
        if (Status != TopUpRequestStatusEnum.PENDING)
            throw new ArgumentException($"Topup sudah berstatus {Status} dan tidak dapat diproses ulang.");
    }
}
