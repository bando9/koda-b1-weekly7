namespace Ewallet.Infrastructure.Identity;

public class RefreshToken
{
    public Guid Id {get;set;}
    public long UserId {get;set;}
    public AppUser User {get;set;} = null!;
    public Guid FamilyId {get;set;}
    public string TokenHash {get;set;} = string.Empty;
    public DateTimeOffset CreatedAtUtc {get;set;}
    public DateTimeOffset ExpiredAtUtc {get;set;}

    public DateTimeOffset? UsedAtUtc {get;set;}
    public DateTimeOffset? RevokedAtUtc {get;set;}
}