using Ewallet.Mvc.DTOs;
using Ewallet.Mvc.Models;
using Ewallet.Mvc.Repositories;

namespace Ewallet.Mvc.Services;


public interface IAuditLogService
{
    // Task<List<AuditLog>> GetAllAsync(CancellationToken ct);
    Task<PagedResultLogs<AuditLogItemResponse>> SearchAsync(AuditLogSearchRequest request, CancellationToken ct);

}

public sealed class AuditLogService(IAuditLogRepository repository) : IAuditLogService
{

    public Task<PagedResultLogs<AuditLogItemResponse>> SearchAsync(AuditLogSearchRequest request, CancellationToken ct) => repository.SearchAsync(request,ct);
}