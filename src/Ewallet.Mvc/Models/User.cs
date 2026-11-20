using System.Text.Json.Serialization;

namespace Ewallet.Mvc.Models;


[JsonConverter(typeof(JsonStringEnumConverter))]
public enum UserStatusEnum {
    ACTIVE, 
    SUSPENDED
}


public sealed class User
{
    private User() { }
    public long Id {get; private set;}
    public string Username {get; private set;} = string.Empty;
    public string FullName {get; private set;} = string.Empty;    
    public string Email {get; private set;} = string.Empty;    
    public string Phone {get; private set;} = string.Empty;    
    public string? PasswordHash {get; private set;}    
    public UserStatusEnum Status {get; private set;}    
    public DateTime CreatedAtUtc {get; private set;}
    public DateTime? UpdatedAtUtc {get; private set;}

    // constraint wallet
    public Wallet? Wallet {get; private set;}
    public ICollection<AuditLog> AuditLogs {get; private set;} = new List<AuditLog>();


    public User(long id,string userName, string fullName, string email, string phone, string? passwordHash, UserStatusEnum status)
    {
        Id=id;
        Username=userName;
        FullName=fullName;
        Email=email;
        Phone=phone;
        PasswordHash=passwordHash;
        Status=status;
        CreatedAtUtc=DateTime.UtcNow.AddHours(7);
    }

}

