using Ewallet.Mvc.Models;

namespace Ewallet.Mvc.DTOs;

public sealed record UserResponse(long Id, string Username, string FullName, string Email, string Phone, UserStatusEnum Status, DateTime CreatedAtUtc, DateTime? UpdatedAtUtc)
{
    public static UserResponse FromModel(User user) => new(user.Id, user.Username,user.FullName,user.Email,user.Phone,user.Status,user.CreatedAtUtc,user.UpdatedAtUtc);
}