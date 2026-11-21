namespace Ewallet.Domain.Entities;



public enum TransactionTypeEnum {
    TOPUP, 
    TRANSFER
}

public enum TransactionStatusEnum {
    PENDING, 
    SUCCESS, 
    FAILED
}



public sealed class Transaction
{
    private Transaction() { }

    public long Id {get; private set;}
    public string ReferenceNo {get; private set;} = string.Empty;
    public TransactionTypeEnum Type {get; private set;}
    public decimal Amount {get; private set;} 
    public TransactionStatusEnum Status {get; private set;}
    public string? Description {get; private set;}
    public DateTime CreatedAtUtc {get; private set;}
    public DateTime? CompletedAtUtc {get; private set;}

    // FK Wallet Sender
    public long? SenderWalletId {get; private set;} 
    public Wallet? SenderWallet {get; private set;}

    // FK Wallet Receiver
    public long ReceiverWalletId {get; private set;} 
    public Wallet ReceiverWallet {get; private set;} = null!;

    // constraint 
    public TopUpRequest? TopUpRequest {get; private set;}
    public ICollection<WalletMutation> WalletMutations {get; private set;} = new List<WalletMutation>();
    public ICollection<AuditLog> AuditLogs {get; private set;} = new List<AuditLog>();
 
    public Transaction(long id, string referenceNo, TransactionTypeEnum type, decimal amount, TransactionStatusEnum status, string? description, DateTime createdAtUtc, DateTime? completedAtUtc, long? senderWalletId, long receiverWalletId)
    {
        Id = id;
        ReferenceNo = referenceNo;
        Type = type;
        Amount = amount;
        Status = status;
        Description = description;
        CreatedAtUtc = createdAtUtc;
        CompletedAtUtc = completedAtUtc;
        SenderWalletId = senderWalletId;
        ReceiverWalletId = receiverWalletId;
    }


    public static Transaction CreateTopUp (string referenceNo, long receiverWalletId, decimal amount, string? description, DateTime nowUtc)
    {
        if(amount <= 0) throw new ArgumentException("nominal harus lebih dari 0");

        return new Transaction
        {
            ReferenceNo = referenceNo,
            Type = TransactionTypeEnum.TOPUP,
            SenderWalletId = null,
            ReceiverWalletId = receiverWalletId,
            Amount = amount,
            Status = TransactionStatusEnum.PENDING,
            Description = description,
            CreatedAtUtc = nowUtc,
            CompletedAtUtc = null
        };
    }

    public static Transaction CreateTransfer(
        string referenceNo, long senderWalletId, long receiverWalletId,
        decimal amount, string? description, DateTime nowUtc)
    {
        if (amount <= 0)
            throw new ArgumentException("Nominal harus lebih dari 0.");
        if (senderWalletId == receiverWalletId)
            throw new ArgumentException("Wallet pengirim dan penerima tidak boleh sama.");

        return new Transaction
        {
            ReferenceNo = referenceNo,
            Type = TransactionTypeEnum.TRANSFER,
            SenderWalletId = senderWalletId,
            ReceiverWalletId = receiverWalletId,
            Amount = amount,
            Status = TransactionStatusEnum.SUCCESS,
            Description = description,
            CreatedAtUtc = nowUtc,
            CompletedAtUtc = nowUtc
        };
    }


    public void MarkSuccess(DateTime nowUtc)
    {
        EnsurePending();
        Status = TransactionStatusEnum.SUCCESS;
        CompletedAtUtc = nowUtc;
    }

    public void MarkFailed(DateTime nowUtc)
    {
        EnsurePending();
        Status = TransactionStatusEnum.FAILED;
        CompletedAtUtc = nowUtc;
    }


    private void EnsurePending()
    {
        if (Status != TransactionStatusEnum.PENDING)
            throw new ArgumentException("Transaksi sudah diproses sebelumnya.");
    }

}

