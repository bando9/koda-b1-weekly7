using System.ComponentModel.DataAnnotations;

namespace Ewallet.Application.DTOs;

public sealed record RegisterRequest
(
    [Required,MaxLength(150)] string FullName,
    [Required,MinLength(4), MaxLength(50)] string UserName,
    [Required,EmailAddress, MaxLength(150)] string Email,
    [Required,Phone, MaxLength(20)] string PhoneNumber,
    [Required,MinLength(8)] string Password
);

public sealed record LoginRequest(
    [Required] string Identifier,
    [Required] string Password
);

public sealed record LoginResponse(
    string Message,
    AuthUserResponse User,
    string AccessToken,
    string TokenType,
    DateTimeOffset ExpiresAtUtc
);

public sealed record AuthUserResponse(
    long Id,
    string FullName,
    string UserName,
    string Email,
    string PhoneNumber,
    string Role,
    long WalletId,
    decimal Balance
);

public enum RegisterStatus
{
    Created, 
    DuplicateEmail, 
    DuplicateUserName, 
    DuplicatePhoneNumber, 
    ValidationError, 
}

public sealed record RegisterResult(
    RegisterStatus Status,
    AuthUserResponse? User,
    string[] Errors
);

public sealed record LoginResult(
    bool Succedded,
    AuthUserResponse User,
    string? ErrorMessage,
    string? AccessToken,
    string? TokenType,
    DateTimeOffset? ExpiresAtUtc
)
{
    public static LoginResult Failure(string errorMessage) => new(false,null!,errorMessage,null,null,null);

    public static LoginResult Success(AuthUserResponse user, string accessToken, DateTimeOffset expiresAtUtc, string tokenType = "Bearer") => new(true,user,null,accessToken,tokenType,expiresAtUtc);
};

