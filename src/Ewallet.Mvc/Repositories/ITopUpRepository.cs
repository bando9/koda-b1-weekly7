using Ewallet.Mvc.DTOs;
using Ewallet.Mvc.Models;

namespace Ewallet.Mvc.Repositories;

public interface ITopUpRepository
{
    Task AddAsync(TopUpRequest request, CancellationToken ct);
    Task<TopUpRequest?> GetByIdAsync(long id,CancellationToken ct);
    Task<TopUpResponse?> GetResponseByIdAsync(long id, CancellationToken ct);
} 