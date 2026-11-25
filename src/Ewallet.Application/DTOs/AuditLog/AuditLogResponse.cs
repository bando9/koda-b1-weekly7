using Ewallet.Domain.Entities;

namespace Ewallet.Application.DTOs;


public sealed record AuditLogItemResponse  (
    long Id,
    string Action,
    string EntityType,
    string? EntityId,
    string Outcome,
    string? Description,
    string? CorrelationId,
    long? ActorUserId,
    long? TransitionId,
    DateTime CreatedAtUtc
);


public sealed record PagedResultLogs<T>(
    long Page, long PageSize, long TotalCount,
    long TotalPages, IReadOnlyList<T> Items
);



