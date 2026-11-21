using Ewallet.Application.DTOs;
using Ewallet.Domain.Entities;
using Ewallet.Application.Repositories;

namespace Ewallet.Application.Services;


public interface IAuditLogService
{
    Task<PagedResultLogs<AuditLogItemResponse>> SearchAsync(AuditLogSearchRequest request, CancellationToken ct);

}

public sealed class AuditLogService(IAuditLogRepository repository) : IAuditLogService
{

    public Task<PagedResultLogs<AuditLogItemResponse>> SearchAsync(AuditLogSearchRequest request, CancellationToken ct) => repository.SearchAsync(request,ct);
}
