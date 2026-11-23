namespace KodaStore.Application.DTOs;

public sealed record CurrentUserResponse(
    long Id,
    string Email,
    IReadOnlyList<string> Roles
);