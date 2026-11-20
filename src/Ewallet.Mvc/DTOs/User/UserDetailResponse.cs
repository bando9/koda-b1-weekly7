using Ewallet.Mvc.Models;

namespace Ewallet.Mvc.DTOs;

public sealed record UserDetailResponse(
    long UserId, string Username, string FullName, string Email, string Phone, UserStatusEnum Status, DateTime CreatedAtUtc,  WalletResponse Wallet
)
{
    public static UserDetailResponse FromModel(User user) => new(user.Id, user.Username,user.FullName,user.Email,user.Phone,user.Status,user.CreatedAtUtc, WalletResponse.FromModel(user.Wallet));
    
}

