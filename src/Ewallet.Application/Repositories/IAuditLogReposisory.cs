using Ewallet.Application.DTOs;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.Repositories;


public interface IAuditLogRepository
{
    Task AddAsync(AuditLog log, CancellationToken ct);

    Task<PagedResultLogs<AuditLogItemResponse>> SearchAsync(AuditLogSearchRequest request,CancellationToken ct);
}
