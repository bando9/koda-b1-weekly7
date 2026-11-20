using Ewallet.Mvc.Models;

namespace Ewallet.Mvc.DTOs;


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


// public sealed record AuditLogResponse(
//     long Id,
//     string Action,
//     string EntityType,
//     string? EntityId,
//     string Outcome,
//     string? Description,
//     string? CorrelationId,
//     long? ActorUserId,
//     long? TransactionId,
//     DateTime CreatedAtUtc
// )
// {
//     public static AuditLogResponse FromModel(AuditLog log) => new(
//         log.Id,
//         log.Action,
//         log.EntityType,
//         log.EntityId,
//         log.Outcome.ToString(),
//         log.Description,
//         log.CorrelationId,
//         log.ActorUserId,
//         log.TransactionId,
//         log.CreatedAtUtc
//     );
// }

