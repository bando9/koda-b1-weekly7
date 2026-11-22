using Ewallet.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Ewallet.Infrastructure.Identity;

public sealed class AppUser : IdentityUser<long> // *Beda (long=>Guid)
{
    public string FullName {get;set;} =string.Empty;
    public UserStatusEnum Status {get;set;} = UserStatusEnum.ACTIVE;
    public DateTimeOffset CreatedAtUtc {get;set;} = DateTimeOffset.UtcNow;
    public DateTimeOffset? UpdatedAtUtc {get;set;}
}