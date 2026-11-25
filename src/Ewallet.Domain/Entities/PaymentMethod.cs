namespace Ewallet.Domain.Entities;

public sealed class PaymentMethod
{
    public int Id {get; private set;}
    public string Code {get; private set;} = string.Empty;
    public string Name {get; private set;}= string.Empty; 
    public string? ProviderName {get; private set;}
    public bool IsActive {get; private set;}
    public DateTime CreatedAtUtc {get; private set;}

    public ICollection<TopUpRequest> TopUpRequests {get; private set;} = new List<TopUpRequest>();

    public PaymentMethod(int id, string code, string name, string? providerName, bool isActive, DateTime createdAtUtc)
    {
        Id = id;
        Code=code;
        Name=name;
        ProviderName=providerName;
        IsActive=isActive;
        CreatedAtUtc=createdAtUtc;
    }
}
