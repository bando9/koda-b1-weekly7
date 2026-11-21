using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Ewallet.Domain.Entities;


[JsonConverter(typeof(JsonStringEnumConverter))]

public enum WalletStatusEnum {
    ACTIVE, 
    FROZEN, 
    CLOSED
}

public sealed class Wallet
{
    private Wallet() { }

    public long Id {get; private set;}
    public string WalletNumber	{get; private set;} = string.Empty;
    public decimal Balance	{get; private set;}
    public WalletStatusEnum Status	{get; private set;}
    public byte[] RowVersion {get; private set;} = null!;
    public DateTime CreatedAtUtc {get; private set;}
    public DateTime? UpdatedAtUtc {get; private set;}

    // FK Users
    public long UserId	{get; private set;}
    public User User {get; private set;} = null!;

    // constraints
    public ICollection<Transaction> SentTransactions {get; private set;} = new List<Transaction>();
    public ICollection<Transaction> ReceivedTransactions  {get; private set;} = new List<Transaction>();
    public ICollection<WalletMutation> WalletMutations {get; private set;} = new List<WalletMutation>();
    public ICollection<TopUpRequest> TopUpRequests {get; private set;} = new List<TopUpRequest>();

    public Wallet(long id, string walletNumber, long userId,WalletStatusEnum status,decimal balance = 0)
    {        
        Id=id;
        WalletNumber=walletNumber;
        Balance = balance >= 0 ? balance : throw new ArgumentException("Saldo gaboleh kurang dari 0");
        Status = status;
        UserId=userId;
        CreatedAtUtc=DateTime.UtcNow;
        UpdatedAtUtc=null;
    }

    public void Credit (decimal amount,DateTime nowUtc)
    {
        if (Status != WalletStatusEnum.ACTIVE)
        {
            throw new InvalidOperationException("Wallet tidak aktif");
        }
        if(amount <= 0)
        {
            throw new InvalidOperationException("nominal harus lebih dari 0.");
        }

        Balance += amount;
        UpdatedAtUtc = nowUtc;
    }

    public void Debit (decimal amount,DateTime nowUtc)
    {
        if (Status != WalletStatusEnum.ACTIVE)
        {
            throw new InvalidOperationException("Wallet tidak aktif");
        }
        if(amount <= 0)
        {
            throw new InvalidOperationException("nominal harus lebih dari 0.");
        }
        if(Balance < amount)
        {
            throw new InvalidOperationException("saldo tidak cukup untuk transaksi");
        }

        Balance -= amount;
        UpdatedAtUtc = nowUtc;
    }



}


