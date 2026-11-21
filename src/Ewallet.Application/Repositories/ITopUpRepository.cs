using Ewallet.Application.DTOs;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.Repositories;

public interface ITopUpRepository
{
    Task AddAsync(TopUpRequest request, CancellationToken ct);
    Task<TopUpRequest?> GetByIdAsync(long id,CancellationToken ct);
    Task<TopUpResponse?> GetResponseByIdAsync(long id, CancellationToken ct);
} 
