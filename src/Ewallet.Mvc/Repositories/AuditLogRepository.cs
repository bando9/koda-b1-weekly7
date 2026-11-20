using Ewallet.Mvc.Data;
using Ewallet.Mvc.DTOs;
using Ewallet.Mvc.Models;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Mvc.Repositories;

public interface IAuditLogRepository
{
    Task AddAsync(AuditLog log, CancellationToken ct);

    Task<PagedResultLogs<AuditLogItemResponse>> SearchAsync(AuditLogSearchRequest request,CancellationToken ct);
}


public sealed class AuditLogRepository(AppDbContext db) : IAuditLogRepository
{
    private readonly AppDbContext _db = db;
    public async Task AddAsync(AuditLog log, CancellationToken ct) => await _db.AuditLogs.AddAsync(log,ct);

    
    public async Task<PagedResultLogs<AuditLogItemResponse>> SearchAsync(AuditLogSearchRequest request,CancellationToken ct)
    {
        var query = _db.AuditLogs.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var keyword = request.Search.Trim();
            query = query.Where(x => x.Description != null && x.Description.Contains(keyword) ||
                                    x.CorrelationId != null && x.CorrelationId.Contains(keyword) ||
                                    x.EntityId != null && x.EntityId.Contains(keyword));
        }

        if (!string.IsNullOrWhiteSpace(request.Action))
        {
            query = query.Where(x => x.Action == request.Action.Trim());
        }

        if (!string.IsNullOrWhiteSpace(request.EntityType))
        {
            query = query.Where(x => x.Action == request.EntityType.Trim());
        }

        if (!string.IsNullOrWhiteSpace(request.EntityId))
        {
            query = query.Where(x => x.Action == request.EntityId.Trim());
        }

        if (request.Outcome.HasValue)
        {
            query = query.Where(x => x.Outcome == request.Outcome.Value);
        }

        if (request.ActorUserId.HasValue)
        {
            query = query.Where(x => x.ActorUserId == request.ActorUserId.Value);
        }

        if (request.TransactionId.HasValue)
        {
            query = query.Where(x => x.TransactionId == request.TransactionId.Value);
        }

        if (request.FromUtc.HasValue)
        {
            query = query.Where(x => x.CreatedAtUtc >= request.FromUtc.Value);
        }

        if (request.ToUtc.HasValue)
        {
            query = query.Where(x => x.CreatedAtUtc <= request.ToUtc.Value);
        }

        long totalCount = await query.LongCountAsync(ct);
        long totalPage = totalCount == 0 ? 0 : (long)Math.Ceiling(totalCount / (double)request.PageSize);

        query = request.Sort.ToLowerInvariant() switch
        {
            "created_asc" => query.OrderBy(x=> x.CreatedAtUtc).ThenBy(x=>x.Id),
            "action_asc" => query.OrderBy(x=> x.Action).ThenByDescending(x=>x.CreatedAtUtc),
            "action_desc" => query.OrderByDescending(x=> x.Action).ThenByDescending(x=>x.CreatedAtUtc),
            "entity_asc" => query.OrderBy(x=> x.EntityType).ThenByDescending(x=>x.CreatedAtUtc),
            "entity_desc" => query.OrderByDescending(x=> x.EntityType).ThenByDescending(x=>x.CreatedAtUtc),
            _ => query.OrderByDescending(x=> x.CreatedAtUtc).ThenByDescending(x=>x.Id),
        };

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x=> new AuditLogItemResponse(
                x.Id,x.Action,x.EntityType,x.EntityId,x.Outcome.ToString(),x.Description,x.CorrelationId,x.ActorUserId,x.TransactionId,x.CreatedAtUtc
            )).ToListAsync(ct);

        return new PagedResultLogs<AuditLogItemResponse>(
            request.Page,request.PageSize,totalCount,totalPage,items
        );
    }
}